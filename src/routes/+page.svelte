<script lang="ts">
	import Map from '$lib/components/Map.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import Header from '$lib/components/Header.svelte';
	import About from '$lib/components/About.svelte';
	import Share from '$lib/components/Share.svelte';
	import { onMount } from 'svelte';
	import data from '$lib/content/data';
	import { comparison, flyTo, mapView, viewState } from '$lib/store.svelte';

	let overOpen = $state(false);
	let shareOpen = $state(false);

	if (!comparison.leftAnnotation) comparison.leftAnnotation = data[0]?.annotation ?? '';
	if (!comparison.rightAnnotation) comparison.rightAnnotation = data[1]?.annotation ?? '';

	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		const lat = params.get('lat');
		const lng = params.get('lng');
		const zoom = params.get('zoom');
		const year = params.get('year');

		if (lat && lng) {
			flyTo.center = [parseFloat(lng), parseFloat(lat)];
			if (zoom) mapView.zoom = parseFloat(zoom);
		}

		if (year) {
			const gevonden = data.find((d) => d.annotation === year);
			if (gevonden) viewState.annotation = gevonden.annotation;
		}
	});
</script>

<div class="flex h-screen flex-col">
	<Header onOverOpen={() => (overOpen = true)} onShareOpen={() => (shareOpen = true)} />

	{#if !comparison.active}
		<div class="flex flex-1 flex-row overflow-hidden">
			<Nav />
			<div class="relative flex-1 grow">
				<Map />
			</div>
		</div>
	{:else}
		<div class="flex flex-1 flex-row overflow-hidden">
			<Nav
				onSelect={(ann) => (comparison.leftAnnotation = ann)}
				opacity={comparison.leftOpacity}
				onOpacityChange={(v) => (comparison.leftOpacity = v)}
			/>
			<div class="relative flex-1 border-r-2 border-gray-300">
				<Map annotation={comparison.leftAnnotation} opacity={comparison.leftOpacity} />
			</div>
			<div class="relative flex-1">
				<Map annotation={comparison.rightAnnotation} opacity={comparison.rightOpacity} />
			</div>
			<Nav
				onSelect={(ann) => (comparison.rightAnnotation = ann)}
				opacity={comparison.rightOpacity}
				onOpacityChange={(v) => (comparison.rightOpacity = v)}
			/>
		</div>
	{/if}

	{#if overOpen}
		<About onClose={() => (overOpen = false)} />
	{/if}

	{#if shareOpen}
		<Share onClose={() => (shareOpen = false)} />
	{/if}
</div>
