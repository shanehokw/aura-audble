<script lang="ts">
	import {
		PUBLIC_CLIENT_ID,
		PUBLIC_REDIRECT_URI,
		PUBLIC_SPOTIFY_AUTH_ENDPOINT,
		PUBLIC_SCOPE
	} from '$env/static/public';

	let generateRandomString = function (length: number) {
		var text = '';
		var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

		for (var i = 0; i < length; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	};

	const SCOPE = PUBLIC_SCOPE;
	const STATE = generateRandomString(16);

	let authParams = new URLSearchParams({
		response_type: 'token',
		show_dialog: 'true',
		client_id: PUBLIC_CLIENT_ID,
		scope: SCOPE,
		redirect_uri: PUBLIC_REDIRECT_URI,
		state: STATE
	});

	let authLink = PUBLIC_SPOTIFY_AUTH_ENDPOINT + authParams;
</script>

<a href={authLink}>Generate aura</a>
