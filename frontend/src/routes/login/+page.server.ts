import { fail, redirect } from '@sveltejs/kit';

export const actions = {// 
	default: async ({ request, locals }) => {
		const data = await request.formData();
		const email = String(data.get('email') ?? '');
		const password = String(data.get('password') ?? '');

		if (!email || !password) {
			return fail(400, { error: 'Missing credentials' });
		}

		try {
			await locals.pb
				.collection('Admin')
				.authWithPassword(email, password);
                //window.location.href = "/admin";
		} catch {
			return fail(401, { error: 'Invalid email or password' });
		}
        

		throw redirect(303, '/admin');
	}
};
