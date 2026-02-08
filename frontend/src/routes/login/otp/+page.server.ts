import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ cookies }) => {
    const otpId = cookies.get('otp_id');
    
    if (!otpId) {
        throw redirect(303, '/login');
    }
    
    return {};
};

export const actions = {
    default: async ({ request, locals, cookies }) => {
        const data = await request.formData();
        const otpCode = String(data.get('otp') ?? '');
        const otpId = cookies.get('otp_id');
        const mfaId = cookies.get('mfa_id');

        if (!otpId || !mfaId) {
            throw redirect(303, '/login');
        }

        if (!otpCode || otpCode.length !== 6) {
            return fail(400, { error: 'Code à 6 chiffres requis' });
        }

        try {
            await locals.pb
                .collection('cms_admins')
                .authWithOTP(otpId, otpCode, { mfaId });

        } catch (e: any) {
            console.log('FAILED:', e?.response);
            return fail(401, { error: 'Code invalide ou expiré' });
        }

        if (!locals.pb.authStore.isValid) {
            return fail(401, { error: 'Authentification échouée' });
        }

        cookies.set('pb_auth', locals.pb.authStore.token, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            secure: true,
            maxAge: 60 * 60 * 24 * 7
        });

        cookies.delete('mfa_id', { path: '/' });
        cookies.delete('otp_id', { path: '/' });

        throw redirect(303, '/admin');
    }
};