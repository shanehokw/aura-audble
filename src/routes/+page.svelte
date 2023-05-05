<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import {
		PUBLIC_CLIENT_ID,
		PUBLIC_REDIRECT_URI,
		PUBLIC_AUTH_ENDPOINT,
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

	const AUTH_ENDPOINT = PUBLIC_AUTH_ENDPOINT;

	const CLIENT_ID = PUBLIC_CLIENT_ID;
	const REDIRECT_URI = PUBLIC_REDIRECT_URI;
	const SCOPE = PUBLIC_SCOPE;
	const STATE = generateRandomString(16);

	let authParams = new URLSearchParams({
		response_type: 'token',
		show_dialog: 'true',
		client_id: CLIENT_ID,
		scope: SCOPE,
		redirect_uri: REDIRECT_URI,
		state: STATE
	});

	let authLink = AUTH_ENDPOINT + authParams;

	const hash = $page.url.hash;

	let loggedIn = false;

	const saveTokenToCookie = async (token: string) => {
		const response = await fetch('/', {
			method: 'POST',
			body: JSON.stringify({ token }),
			headers: {
				'content-type': 'application/json'
			}
		});

		return response.json();
	};

	$: if (browser && hash) {
		const urlParams = new URLSearchParams(hash.replace('#', '?'));

		const token = urlParams.get('access_token');

		if (token) {
			saveTokenToCookie(token);
			window.location.hash = '';
			loggedIn = true;
		} else {
			// TODO: redirect somewhere? maybe a 404 page
		}
	}
</script>

{#if loggedIn}
	<a href="/aura">Generate aura</a>
{:else}
	<a href={authLink}>Login to spotify</a>
{/if}
