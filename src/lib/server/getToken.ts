import { CLIENT_SECRET } from '$env/static/private';
import {
	PUBLIC_SPOTIFY_TOKEN_ENDPOINT,
	PUBLIC_REDIRECT_URI,
	PUBLIC_CLIENT_ID
} from '$env/static/public';
export const getToken = async (code: string) => {
	const res = await fetch(PUBLIC_SPOTIFY_TOKEN_ENDPOINT, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			grant_type: 'authorization_code',
			code: code,
			redirect_uri: PUBLIC_REDIRECT_URI
		})
	});

	await res.json();

	console.log(res);

	return access_token;
};
