// +layout.server.ts
import { redirect } from '@sveltejs/kit';
import { pb } from "$lib/pb";

export const load = async ({ locals, url }) => {

  if (!locals.user) {
    throw redirect(303, `/login?next=${encodeURIComponent(url.pathname)}`);
  }

  return {
    user: locals.user,

  };
};

