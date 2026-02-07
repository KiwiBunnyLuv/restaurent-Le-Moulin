// src/routes/login/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
    default: async ({ request, locals, cookies }) => {
        const data = await request.formData();
        const email = String(data.get('email') ?? '');
        const password = String(data.get('password') ?? '');

        if (!email || !password) {
            return fail(400, { error: 'Missing credentials' });
        }

        try {
            await locals.pb
                .collection('cms_admins')
                .authWithPassword(email, password);

            return redirect(303, '/admin');

        } catch (e: any) {
            const mfaId = e?.response?.mfaId;

            if (mfaId) {
                try {
                    const otpResponse = await locals.pb
                        .collection('cms_admins')
                        .requestOTP(email);

                    cookies.set('mfa_id', mfaId, {
                        path: '/',
                        httpOnly: true,
                        sameSite: 'strict',
                        maxAge: 60 * 5
                    });

                    cookies.set('otp_id', otpResponse.otpId, {
                        path: '/',
                        httpOnly: true,
                        sameSite: 'strict',
                        maxAge: 60 * 5
                    });

                    // ✅ Stocke l'email pour le re-use
                    cookies.set('pending_email', email, {
                        path: '/',
                        httpOnly: true,
                        sameSite: 'strict',
                        maxAge: 60 * 5
                    });

                    console.log('OTP sent, otpId:', otpResponse.otpId);

                } catch (otpError: any) {
                    console.log('OTP ERROR:', JSON.stringify(otpError, null, 2));
                    return fail(500, { error: 'Erreur envoi du code' });
                }

                throw redirect(303, '/login/otp');
            }

            return fail(401, { error: 'Email ou mot de passe invalide' });
        }
    }
};