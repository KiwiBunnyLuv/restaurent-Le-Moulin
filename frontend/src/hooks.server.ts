import PocketBase from 'pocketbase';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const pb = new PocketBase('http://127.0.0.1:8090');

	// ✅ IMPORTANT : header cookie complet
	const cookieHeader = event.request.headers.get('cookie') ?? '';
	pb.authStore.loadFromCookie(cookieHeader);

	// (optionnel) log debug
	// console.log('AUTH VALID?', pb.authStore.isValid);

	event.locals.pb = pb;
	event.locals.user = pb.authStore.record;

	const response = await resolve(event);

	// ✅ IMPORTANT : sur localhost, ne force pas secure:true
	response.headers.append(
		'set-cookie',
		pb.authStore.exportToCookie({
			httpOnly: true,
			sameSite: 'lax',
			secure: false, // ← mets true seulement en prod HTTPS
			path: '/'
		})
	);

	return response;
};
