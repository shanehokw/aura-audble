import {
	PUBLIC_CLIENT_ID,
	PUBLIC_REDIRECT_URI,
	PUBLIC_SPOTIFY_AUTH_ENDPOINT,
	PUBLIC_SCOPE
} from '$env/static/public';

export const GET = async () => {
	const generateRandomString = (length: number) => {
		let text = '';
		const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

		for (let i = 0; i < length; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	};

	const generateCodeChallenge = async (codeVerifier: string) => {
		const encoder = new TextEncoder();
		const data = encoder.encode(codeVerifier);
		const digest = await crypto.subtle.digest('SHA-256', data);

		// encode to base64
		return Buffer.from(digest).toString();
	};

	const STATE = generateRandomString(16);
	const codeVerifier = generateRandomString(128);
	const codeChallenge = await generateCodeChallenge(codeVerifier);

	const authParams = new URLSearchParams({
		response_type: 'code',
		show_dialog: 'true',
		client_id: PUBLIC_CLIENT_ID,
		scope: PUBLIC_SCOPE,
		redirect_uri: PUBLIC_REDIRECT_URI,
		state: STATE,
		code_challenge_method: '256',
		code_challenge: codeChallenge
	});

	const authLink = PUBLIC_SPOTIFY_AUTH_ENDPOINT + authParams;

	return authLink;
};
