import type { Handle } from '@sveltejs/kit';
import { pb } from '$lib/pb';
import { dev } from '$app/environment';

export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get('pb_auth');
    
    if (token) {
        pb.authStore.save(token, null);
        
        try {
            // Refresh pour récupérer le record
            await pb.collection('cms_admins').authRefresh();
            event.locals.user = pb.authStore.record;
        } catch (err) {
            pb.authStore.clear();
            event.locals.user = null;
            event.cookies.delete('pb_auth', { path: '/' });
        }
    } else {
        pb.authStore.clear();
        event.locals.user = null;
    }

    event.locals.pb = pb;

    const response = await resolve(event);
    return response;
};