export default {
	async get(endpoint: string, token: string) {
		const res = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
			headers: {
				Authorization: `Bearer ${token}`
			},
			method: 'GET'
		});

		return await res.json();
	},
	async post(endpoint: string, token: string, body: object | null) {
		const res = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
			headers: {
				Authorization: `Bearer ${token}`
			},
			method: 'POST',
			body: JSON.stringify(body)
		});
		return await res.json();
	}
};
