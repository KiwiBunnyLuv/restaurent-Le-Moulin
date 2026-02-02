import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, cookies }) => {
	// Déconnecte PocketBase
	locals.pb.authStore.clear();

	  // Supprime le cookie d'auth (optionnel mais plus sûr)
  cookies.delete('pb_auth', { path: '/' });
	
	// Redirige vers la page de login
	throw redirect(303, '/login');
};