<script lang="ts">
	import { Aura } from '$lib/Aura.js';
	import { onMount } from 'svelte';

	export let data;

	const { featureColours } = data;
	let canvas: HTMLCanvasElement;

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
