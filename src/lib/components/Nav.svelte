<script lang="ts">
	import { MapCollection } from '$lib/models/MapCollection';
	import { viewState } from '$lib/store.svelte';

	let {
		onSelect = null,
		opacity = null,
		onOpacityChange = null
	}: {
		onSelect?: ((annotation: string) => void) | null;
		opacity?: number | null;
		onOpacityChange?: ((value: number) => void) | null;
	} = $props();

	const collection = new MapCollection();
	const maps = collection.getAllMaps();

	let activeYear = $state(maps[0]?.metadata.year);

	$effect(() => {
		if (!onSelect) {
			viewState.annotation = maps[0]?.metadata.annotation;
		}
	});

	function select(map: (typeof maps)[0]) {
		activeYear = map.metadata.year;
		if (onSelect) {
			onSelect(map.metadata.annotation);
		} else {
			viewState.annotation = map.metadata.annotation;
		}
	}

	function handleOpacity(e: Event) {
		const value = Number((e.target as HTMLInputElement).value);
		if (onOpacityChange) {
			onOpacityChange(value);
		} else {
			viewState.opacity = value;
		}
	}

	let currentOpacity = $derived(onSelect ? (opacity ?? 100) : viewState.opacity);
</script>

<aside
	class="w-56 flex-none overflow-y-auto bg-gray-50 p-4"
	style="font-family: 'Barlow Condensed', sans-serif;"
>
	<h2 class="mb-4 text-sm font-bold tracking-widest text-gray-500 uppercase">Kaartcollectie</h2>
	<ul class="flex flex-col divide-y divide-gray-200">
		{#each maps as map}
			<li>
				<button
					onclick={() => select(map)}
					class="flex w-full items-center gap-3 px-3 py-2 {activeYear === map.metadata.year
						? 'bg-gray-800 text-white'
						: 'hover:bg-gray-200'}"
				>
					<span class="text-xs font-bold {map.getYearColor()}">{map.metadata.year}</span>
					<span class="text-sm">{map.metadata.label}</span>
				</button>
			</li>
		{/each}
	</ul>

	<div class="mt-6 border-t border-gray-200 pt-4">
		<p class="mb-3 text-xs font-bold tracking-widest text-gray-500 uppercase">Transparantie</p>
		<input
			value={currentOpacity}
			oninput={handleOpacity}
			type="range"
			min="0"
			max="100"
			class="w-full accent-green-700"
		/>
		<div class="mt-1 flex justify-between text-xs text-gray-400">
			<span>0%</span>
			<span class="font-bold text-gray-700">{currentOpacity}%</span>
			<span>100%</span>
		</div>
	</div>

	<div class="mt-6 border-t border-gray-200 pt-4">
		<p class="mb-3 text-xs font-bold tracking-widest text-gray-500 uppercase">Kaartinfo</p>
		{#each maps as map}
			{#if map.metadata.year === activeYear}
				<dl class="flex flex-col gap-1 text-xs text-gray-700">
					<div class="flex justify-between border-b border-gray-100 py-1">
						<dt class="text-gray-500">Jaar</dt>
						<dd class="font-semibold">{map.metadata.year}</dd>
					</div>
					<div class="flex justify-between border-b border-gray-100 py-1">
						<dt class="text-gray-500">Bron</dt>
						<dd class="text-right font-semibold">{map.metadata.institution}</dd>
					</div>
					<div class="flex justify-between border-b border-gray-100 py-1">
						<dt class="text-gray-500">Formaat</dt>
						<dd class="font-semibold">{map.metadata.iiif ? 'IIIF / GeoRef' : 'GeoRef'}</dd>
					</div>
				</dl>

				<a
					href={map.metadata.iiif?.type === 'image'
						? map.metadata.iiif.url + '/full/full/0/default.jpg'
						: map.metadata.url}
					target="_blank"
					download
					class="mt-2 flex w-full items-center justify-center gap-2 rounded border border-green-700 px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-50"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 10l5 5 5-5M12 15V3"
						/>
					</svg>
					Download kaart
				</a>
			{/if}
		{/each}
	</div>
</aside>
