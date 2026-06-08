<script lang="ts">
	import { comparison, flyTo, selectedLocation } from '$lib/store.svelte';
	import { SearchService } from '$lib/models/SearchService.svelte';

	let { onOverOpen, onShareOpen, onMenuToggle }: { onOverOpen: () => void; onShareOpen: () => void; onMenuToggle: () => void } = $props();

	const search = new SearchService();
</script>

<nav
	class="flex flex-none items-center justify-between bg-green-700 px-4 py-2 text-white"
	style="font-family: 'Barlow Condensed', sans-serif;"
>
	<div class="flex items-center gap-3">
		<button onclick={onMenuToggle} aria-label="Menu" class="flex flex-col gap-1 md:hidden">
			<span class="block h-0.5 w-5 bg-white"></span>
			<span class="block h-0.5 w-5 bg-white"></span>
			<span class="block h-0.5 w-5 bg-white"></span>
		</button>

		<div class="flex items-center space-x-35">
			<div class="flex items-center rounded bg-white px-2 py-1">
				<input
					type="text"
					placeholder="Zoek locatie..."
					class="w-28 md:w-48 bg-transparent text-sm text-gray-800 outline-none"
					bind:value={search.searchTerm}
					oninput={() => search.searchWithDelay()}
				/>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4 text-gray-500"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
					/>
				</svg>

				{#if search.results.length > 0}
					<div class="absolute top-12 left-4 z-50 w-72 rounded bg-white shadow-lg">
						{#each search.results as result}
							<button
								class="w-full border-b border-gray-200 px-3 py-2 text-left text-sm text-gray-800 hover:bg-gray-100"
								onclick={() => {
									const coords = search.selectLocation(result);
									flyTo.center = coords;
									selectedLocation.center = coords;
								}}
							>
								{result.display_name}
							</button>
						{/each}
					</div>
				{/if}
			</div>

			<button
				onclick={() => (comparison.active = !comparison.active)}
				class="hidden md:flex items-center justify-center gap-2 rounded border border-gray-400 px-3 py-1 text-sm font-semibold text-white hover:bg-gray-600 {comparison.active
					? 'bg-gray-600'
					: ''}"
			>
				{comparison.active ? 'Sluiten' : 'Vergelijken'}
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
						d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4M15 3h4a2 2 0 0 0 2 2v14a2 2 0 0 0-2 2h-4M12 3v18"
					/>
				</svg>
			</button>

			<h1 class="text-2xl font-bold" style="font-family: 'Barlow Condensed', sans-serif;">
				Rotterdam Tijdmachine
			</h1>
			<button onclick={onOverOpen} class="hidden md:block hover:text-yellow-400">Over</button>
			<button onclick={onShareOpen} class="hidden md:block hover:text-yellow-400">Delen</button>
		</div>
	</div>
</nav>
