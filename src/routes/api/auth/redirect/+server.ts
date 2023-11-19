import { COOKIES, ENDPOINTS, SPOTIFY_AUTH_URL } from '$lib/constants';
import { redirect, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { CLIENT_ID, REDIRECT_URI } from '$env/static/private';

// type TokenResponse = {
// 	access_token: string;
// 	token_type: string;
// 	scope: string;
// 	expires_in: number;
// 	refresh_token: string;
// };

export const GET: RequestHandler = async ({ url, request, cookies, fetch }) => {
	const code = url.searchParams.get('code') ?? null;
	const state = url.searchParams.get('state') ?? null;

	const storedState = cookies.get(COOKIES.AUTH_STATE) ?? null;
	const storedChallengeVerifier = cookies.get(COOKIES.AUTH_VERIFIER) ?? null;

	if (state === null || state !== storedState) {
		throw error(404, 'State mismatched');
	}

	if (!code) {
		throw error(404, 'No code!');
	}

	const req = await fetch(`${SPOTIFY_AUTH_URL}/${ENDPOINTS.TOKEN}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			client_id: CLIENT_ID,
			code: code,
			grant_type: 'authorization_code',
			redirect_uri: REDIRECT_URI,
			code_verifier: storedChallengeVerifier ?? ''
		})
	});

	const res = await req.json();

	if (res.error) {
		throw error(400, res.error_description);
	}

	// remove PKCE-related cookies
	cookies.delete(COOKIES.AUTH_STATE);
	cookies.delete(COOKIES.AUTH_VERIFIER);

	cookies.set(COOKIES.ACCESS_TOKEN, res.access_token, { path: '/' });
	cookies.set(COOKIES.REFRESH_TOKEN, res.refresh_token, { path: '/' });

	throw redirect(303, '/aura');
};
