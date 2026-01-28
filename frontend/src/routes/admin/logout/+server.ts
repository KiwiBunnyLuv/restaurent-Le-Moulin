import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals }) => {
	// Déconnecte PocketBase
	locals.pb.authStore.clear();
	
	// Redirige vers la page de login
	throw redirect(303, '/login');
};