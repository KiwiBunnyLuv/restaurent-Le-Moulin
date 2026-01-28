import { redirect } from '@sveltejs/kit';

function isHiddenCollection(name: string) {
	// cache ce qui ne doit pas apparaitre dans le CRUD
	return name.startsWith('_') || ['Admin'].includes(name);
}

export const load = async ({ locals, url }) => {
	if (!locals.user) {
		throw redirect(303, `/login?next=${encodeURIComponent(url.pathname)}`);
	}

	// 1) Collections -> sidebar CRUD auto
	let collections: { name: string }[] = [];
	try {
		// Selon version du SDK PB:
		// - si locals.pb.collections.getFullList existe, utilise-le
		// - sinon, fallback via /api/collections
		const anyPb: any = locals.pb as any;

		if (anyPb.collections?.getFullList) {
			const list = await anyPb.collections.getFullList({ sort: 'name' });
			collections = list.map((c: any) => ({ name: c.name }));
		} else {
			const res = await anyPb.send('/api/collections', { method: 'GET' });
			collections = (res?.items ?? []).map((c: any) => ({ name: c.name }));
		}
	} catch (e) {
		// si PB refuse la liste, tu peux mettre une liste manuelle temporaire
        console.error('PB collections error:', e);
		collections = [];
	}

	const crudCollections = collections.filter((c) => !isHiddenCollection(c.name));

	// 2) Optionnel: si tu as des collections "sites" et "pages"
	// pour /site-settings et /page-settings
	const sites = await locals.pb.collection('sites').getFullList({ sort: 'name' }).catch(() => []);
	const pages = await locals.pb.collection('pages').getFullList({ sort: 'title' }).catch(() => []);

	return {
		user: locals.user,
		navMain: {
			crud: crudCollections,
			sites,
			pages
		}
	};
};
