    import type { PageServerLoad } from './$types';

    const POCKETBASE_URL = 'http://127.0.0.1:8090';

    export const load: PageServerLoad = async ({ fetch }) => {
        try {
            const settingsRes = await fetch(`${POCKETBASE_URL}/api/collections/Site_Settings/records`);
            const settingsData = await settingsRes.json();
            const settings = settingsData.items?.[0] || null;

            const horaireRes = await fetch(`${POCKETBASE_URL}/api/collections/Horaire/records?sort=created`);
            const horaireData = await horaireRes.json();
            const horaires = horaireData.items || [];

            const menuRes = await fetch(`${POCKETBASE_URL}/api/collections/Menu/records`);
            const menuData = await menuRes.json();
            const menus = menuData.items || [];

            // Charger TOUS les médias, triés par order
            const mediaRes = await fetch(`${POCKETBASE_URL}/api/collections/Media/records?sort=order`);
            const mediaData = await mediaRes.json();
            const media = mediaData.items || [];

            return {
                settings,
                horaires,
                menus,
                media,
                pocketbaseUrl: POCKETBASE_URL
            };
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
            return {
                settings: null,
                horaires: [],
                menus: [],
                media: [],
                pocketbaseUrl: POCKETBASE_URL
            };
        }
    };