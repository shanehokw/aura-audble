import { PUBLIC_SCOPE } from '$env/static/public';
import { COOKIES, ENDPOINTS, SPOTIFY_AUTH_URL } from '$lib/constants';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import pkceChallenge from 'pkce-challenge';
import { CLIENT_ID, REDIRECT_URI } from '$env/static/private';

const generateRandomString = (length: number) => {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
};

const state = generateRandomString(16);
const challenge = await pkceChallenge();

const scope = PUBLIC_SCOPE;

export const GET: RequestHandler = ({ cookies }) => {
	cookies.set(COOKIES.AUTH_STATE, state);
	cookies.set(COOKIES.AUTH_VERIFIER, challenge.code_verifier);

	let authParams = new URLSearchParams({
		response_type: 'code',
		show_dialog: 'true',
		client_id: CLIENT_ID,
		scope: scope,
		redirect_uri: REDIRECT_URI,
		state: state,
		code_challenge_method: 'S256',
		code_challenge: challenge.code_challenge
	});

	throw redirect(307, `${SPOTIFY_AUTH_URL}/${ENDPOINTS.AUTH}?${authParams}`);
};
