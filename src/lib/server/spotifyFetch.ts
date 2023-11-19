import { SPOTIFY_API_URL } from '$lib/constants';

export default {
	get: async (endpoint: string) => {
		const res = await fetch(`${SPOTIFY_API_URL}/${endpoint}`, {
			method: 'GET'
		});

		return await res.json();
	},
	post: async (endpoint: string, body: object | null) => {
		const res = await fetch(`${SPOTIFY_API_URL}/${endpoint}`, {
			method: 'POST',
			body: JSON.stringify(body)
		});
		return await res.json();
	}
};
