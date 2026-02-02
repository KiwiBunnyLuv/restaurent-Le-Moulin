import type { PageServerLoad } from './$types';
import { pb } from '$lib/pb';
import {url} from '$lib/pb';

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