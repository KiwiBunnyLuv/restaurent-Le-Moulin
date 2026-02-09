import { randomUUID } from 'crypto';

type AttemptRecord = {
	count: number;
	firstAttemptAt: number;
	blockedUntil: number | null;
};

type CaptchaRecord = {
	answer: string;
	expiresAt: number;
};

const LOGIN_WINDOW_MS = 5 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_CAPTCHA_AFTER = 3;
const LOGIN_BLOCK_BASE_MS = 5 * 60 * 1000;

const CONTACT_WINDOW_MS = 10 * 60 * 1000;
const CONTACT_MAX_ATTEMPTS = 4;

const captchaStore = new Map<string, CaptchaRecord>();
const loginAttempts = new Map<string, AttemptRecord>();
const contactAttempts = new Map<string, AttemptRecord>();

const now = () => Date.now();

const cleanAttempts = (store: Map<string, AttemptRecord>, windowMs: number) => {
	const cutoff = now() - windowMs;
	for (const [key, record] of store.entries()) {
		if (record.firstAttemptAt < cutoff && !record.blockedUntil) {
			store.delete(key);
		}
	}
};

const cleanCaptchas = () => {
	const cutoff = now();
	for (const [token, record] of captchaStore.entries()) {
		if (record.expiresAt < cutoff) {
			captchaStore.delete(token);
		}
	}
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const getClientId = (request: Request, fallbackKey: string) => {
	const forwardedFor = request.headers.get('x-forwarded-for');
	const ip = forwardedFor?.split(',')[0]?.trim();
	const ua = request.headers.get('user-agent') ?? 'unknown';
	return `${ip ?? 'unknown'}:${fallbackKey}:${ua}`;
};

export const checkLoginAttempt = (key: string) => {
	cleanAttempts(loginAttempts, LOGIN_WINDOW_MS);
	const current = loginAttempts.get(key);
	const timestamp = now();

	if (current?.blockedUntil && current.blockedUntil > timestamp) {
		return {
			blocked: true,
			retryAfterMs: current.blockedUntil - timestamp,
			requireCaptcha: true
		};
	}

	const count = current?.count ?? 0;
	return {
		blocked: false,
		retryAfterMs: 0,
		requireCaptcha: count >= LOGIN_CAPTCHA_AFTER
	};
};

export const recordLoginFailure = (key: string) => {
	const timestamp = now();
	const current = loginAttempts.get(key);
	if (!current || timestamp - current.firstAttemptAt > LOGIN_WINDOW_MS) {
		loginAttempts.set(key, {
			count: 1,
			firstAttemptAt: timestamp,
			blockedUntil: null
		});
		return;
	}

	const nextCount = current.count + 1;
	const overLimit = nextCount >= LOGIN_MAX_ATTEMPTS;
	const blockMultiplier = clamp(nextCount - LOGIN_MAX_ATTEMPTS + 1, 0, 4);
	const blockDuration = overLimit ? LOGIN_BLOCK_BASE_MS * Math.pow(2, blockMultiplier) : 0;

	loginAttempts.set(key, {
		count: nextCount,
		firstAttemptAt: current.firstAttemptAt,
		blockedUntil: overLimit ? timestamp + blockDuration : null
	});
};

export const recordLoginSuccess = (key: string) => {
	loginAttempts.delete(key);
};

export const createCaptcha = () => {
	cleanCaptchas();
	const a = Math.floor(Math.random() * 8) + 1;
	const b = Math.floor(Math.random() * 8) + 1;
	const token = randomUUID();
	const answer = String(a + b);
	const expiresAt = now() + 5 * 60 * 1000;
	const question = `Combien font ${a} + ${b} ?`;

	captchaStore.set(token, { answer, expiresAt });

	return { token, question };
};

export const verifyCaptcha = (token: string, answer: string) => {
	cleanCaptchas();
	const record = captchaStore.get(token);
	if (!record) {
		return false;
	}
	if (record.expiresAt < now()) {
		captchaStore.delete(token);
		return false;
	}

	const ok = record.answer === answer.trim();
	if (ok) {
		captchaStore.delete(token);
	}
	return ok;
};

export const checkContactAttempt = (key: string) => {
	cleanAttempts(contactAttempts, CONTACT_WINDOW_MS);
	const current = contactAttempts.get(key);
	const timestamp = now();

	if (current?.blockedUntil && current.blockedUntil > timestamp) {
		return {
			blocked: true,
			retryAfterMs: current.blockedUntil - timestamp
		};
	}

	return {
		blocked: false,
		retryAfterMs: 0
	};
};

export const recordContactAttempt = (key: string) => {
	const timestamp = now();
	const current = contactAttempts.get(key);
	if (!current || timestamp - current.firstAttemptAt > CONTACT_WINDOW_MS) {
		contactAttempts.set(key, {
			count: 1,
			firstAttemptAt: timestamp,
			blockedUntil: null
		});
		return;
	}

	const nextCount = current.count + 1;
	const overLimit = nextCount >= CONTACT_MAX_ATTEMPTS;
	const blockDuration = overLimit ? 10 * 60 * 1000 : 0;

	contactAttempts.set(key, {
		count: nextCount,
		firstAttemptAt: current.firstAttemptAt,
		blockedUntil: overLimit ? timestamp + blockDuration : null
	});
};

export const clearContactAttempts = (key: string) => {
	contactAttempts.delete(key);
};
