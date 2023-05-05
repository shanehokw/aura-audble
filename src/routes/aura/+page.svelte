<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { Aura } from '$lib/Aura.js';
	import { onMount } from 'svelte';

	export let data;

	const { featureColours } = data;
	let canvas: HTMLCanvasElement;

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

	const hash = $page.url.hash;

	$: if (browser && hash) {
		const urlParams = new URLSearchParams(hash.replace('#', '?'));

		const token = urlParams.get('access_token');

		if (token) {
			saveTokenToCookie(token);
			window.location.hash = '';
		} else {
			// TODO: redirect somewhere? maybe a 404 page
		}
	}

	onMount(async () => {
		new Aura(canvas, [featureColours.danceability, featureColours.energy, featureColours.valence]);
	});
</script>

<div class="grid">
	<div class="aura-frame">
		<canvas id="aura" bind:this={canvas} />
	</div>
</div>

<style>
	canvas {
		height: 100%;
		width: 100%;
	}

	.grid {
		display: grid;
		place-items: center;
		width: 100dvw;
		height: 100dvh;
	}
</style>
