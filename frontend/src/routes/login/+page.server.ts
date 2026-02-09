// src/routes/login/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';
import {
	checkLoginAttempt,
	createCaptcha,
	getClientId,
	recordLoginFailure,
	recordLoginSuccess,
	verifyCaptcha
} from '$lib/server/security';

export const actions = {
    default: async ({ request, locals, cookies }) => {
        const data = await request.formData();
        const email = String(data.get('email') ?? '');
        const password = String(data.get('password') ?? '');
        const captchaToken = String(data.get('captcha_token') ?? '');
        const captchaAnswer = String(data.get('captcha_answer') ?? '');

        if (!email || !password) {
            return fail(400, { error: 'Missing credentials' });
        }

        const clientKey = getClientId(request, email.toLowerCase());
        const attemptState = checkLoginAttempt(clientKey);
        if (attemptState.blocked) {
            const captcha = createCaptcha();
            return fail(429, {
                error: 'Trop de tentatives. Veuillez réessayer plus tard.',
                requireCaptcha: true,
                retryAfterMs: attemptState.retryAfterMs,
                captchaQuestion: captcha.question,
                captchaToken: captcha.token
            });
        }

        if (attemptState.requireCaptcha) {
            const validCaptcha = verifyCaptcha(captchaToken, captchaAnswer);
            if (!validCaptcha) {
                recordLoginFailure(clientKey);
                const captcha = createCaptcha();
                return fail(400, {
                    error: 'Veuillez résoudre le captcha pour continuer.',
                    requireCaptcha: true,
                    captchaQuestion: captcha.question,
                    captchaToken: captcha.token
                });
            }
        }

        try {
            await locals.pb
                .collection('cms_admins')
                .authWithPassword(email, password);

            recordLoginSuccess(clientKey);
            return redirect(303, '/admin');

        } catch (e: any) {
            const mfaId = e?.response?.mfaId;

            if (mfaId) {
                try {
                    recordLoginSuccess(clientKey);
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

            recordLoginFailure(clientKey);
            const postFailState = checkLoginAttempt(clientKey);
            if (postFailState.requireCaptcha) {
                const captcha = createCaptcha();
                return fail(401, {
                    error: 'Email ou mot de passe invalide',
                    requireCaptcha: true,
                    captchaQuestion: captcha.question,
                    captchaToken: captcha.token
                });
            }

            return fail(401, { error: 'Email ou mot de passe invalide' });
        }
    }
};
