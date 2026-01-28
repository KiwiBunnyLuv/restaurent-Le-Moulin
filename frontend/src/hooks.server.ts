import PocketBase from 'pocketbase';
import type { Handle } from '@sveltejs/kit';
import { pb } from '$lib/pb';
import { dev } from '$app/environment';

export const handle: Handle = async ({ event, resolve }) => {
	const cookieHeader = event.request.headers.get('cookie') ?? '';
	pb.authStore.loadFromCookie(cookieHeader);

	// ✅ IMPORTANT : Vérifie si le token est valide
	if (pb.authStore.isValid) {
		try {
			// Vérifie que le token fonctionne vraiment en essayant de rafraîchir
			await pb.collection('Admin').authRefresh();
			event.locals.user = pb.authStore.record;
		} catch (err) {
			// Token invalide/expiré, on clear tout
			pb.authStore.clear();
			event.locals.user = null;
		}
	} else {
		// Token pas valide du tout
		pb.authStore.clear();
		event.locals.user = null;
	}

	event.locals.pb = pb;

	const response = await resolve(event);

	response.headers.append(
		'set-cookie',
		pb.authStore.exportToCookie({
			httpOnly: true,
			sameSite: 'lax',
			secure: !dev,
			path: '/',
			maxAge: 3600 // 1 heure
		})
	);

	return response;
};
