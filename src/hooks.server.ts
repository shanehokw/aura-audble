import { COOKIES, SPOTIFY_API_URL } from '$lib/constants';
import type { HandleFetch } from '@sveltejs/kit';

export const handleFetch: HandleFetch = async ({ request, fetch, event }) => {
	if (request.url.startsWith(SPOTIFY_API_URL)) {
		const token = event.cookies.get(COOKIES.ACCESS_TOKEN);

		request.headers.append('Authorization', 'Bearer ' + token);
	}

	return fetch(request);
};
