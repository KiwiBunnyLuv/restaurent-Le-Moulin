import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { url } from '$lib/pb';

const POCKETBASE_URL = url;

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const settingsRes = await fetch(`${POCKETBASE_URL}/api/collections/Site_Settings/records`);
		const settingsData = await settingsRes.json();
		const settings = settingsData.items?.[0] || null;

		const horaireRes = await fetch(
			`${POCKETBASE_URL}/api/collections/Horaire/records?sort=created`
		);
		const horaireData = await horaireRes.json();
		const horaires = horaireData.items || [];

		return {
			settings,
			horaires,
			pocketbaseUrl: POCKETBASE_URL
		};
	} catch (error) {
		console.error('Erreur lors du chargement des données:', error);
		return {
			settings: null,
			horaires: [],
			pocketbaseUrl: POCKETBASE_URL
		};
	}
};

export const actions: Actions = {
	contact: async ({ request, fetch }) => {
		const formData = await request.formData();
		const nom = formData.get('nom')?.toString().trim() || '';
		const email = formData.get('email')?.toString().trim() || '';
		const message = formData.get('message')?.toString().trim() || '';

		// ===== Validation =====
		if (!nom || !email || !message) {
			return fail(400, {
				error: 'Tous les champs sont requis.',
				nom,
				email,
				message
			});
		}

		// Validation email basique
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return fail(400, {
				error: 'Veuillez entrer une adresse courriel valide.',
				nom,
				email,
				message
			});
		}

		try {
			// ===== Sauvegarder dans PocketBase =====
			// Tu dois créer une collection "Contact_Messages" dans PocketBase
			// avec les champs: nom (text), email (email), message (text)
			const res = await fetch(`${POCKETBASE_URL}/api/collections/Contact_Messages/records`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ nom, email, message })
			});

			if (!res.ok) {
				const errorData = await res.json();
				console.error('Erreur PocketBase:', errorData);
				return fail(500, {
					error: 'Une erreur est survenue. Veuillez réessayer.',
					nom,
					email,
					message
				});
			}

			return { success: true };
		} catch (error) {
			console.error('Erreur envoi formulaire:', error);
			return fail(500, {
				error: 'Une erreur est survenue. Veuillez réessayer.',
				nom,
				email,
				message
			});
		}
	}
};