<script lang="ts">
	import { comparison } from '$lib/app-state.svelte.js';
	import Search from '$lib/components/Search.svelte';
	import { Columns2, Info, Share2 } from '@lucide/svelte';
	import type { AppConfig, GeocoderBounds } from '$lib/types';

	let {
		searchBounds,
		config,
		onAboutOpen,
		onShareOpen
	}: {
		searchBounds?: GeocoderBounds;
		config: AppConfig;
		onAboutOpen: () => void;
		onShareOpen: () => void;
	} = $props();

	function toggleCompare() {
		comparison.active = !comparison.active;
	}
</script>

<header class="font-bolder">
	<nav
		aria-label="Global"
		class="flex flex-none items-center justify-between gap-2 border-b border-brand-hover/20 bg-brand-main p-2 text-white md:px-8"
	>
		<div class="flex min-w-0 flex-1 items-center gap-2">
			<Search bounds={searchBounds} {config} />

			<button
				onclick={toggleCompare}
				data-tour="compare"
				aria-label={config.header.compareMode}
				aria-pressed={comparison.active}
				class="flex h-8 cursor-pointer items-center gap-2 rounded px-2 text-sm font-semibold hover:bg-brand-hover md:px-3 {comparison.active
					? 'bg-brand-hover'
					: ''}"
			>
				<Columns2 class="h-4 w-4" />
				<span class="hidden md:inline"
					>{comparison.active ? config.header.closeCompare : config.header.compare}</span
				>
			</button>
		</div>

		<div class="relative flex flex-none justify-center px-1 text-center">
			<h1 class="font-heading text-lg leading-none font-bold select-none md:text-2xl">
				{config.site.name}
			</h1>
		</div>

		<div class="flex flex-1 justify-end gap-1 md:gap-2">
			<button
				onclick={onAboutOpen}
				aria-label={config.header.about}
				class="flex h-8 cursor-pointer items-center gap-1 rounded px-2 text-sm font-semibold hover:bg-brand-hover md:px-3"
			>
				<Info class="h-4 w-4" />
				<span class="hidden sm:inline">{config.header.about}</span>
			</button>
			<button
				onclick={onShareOpen}
				aria-label={config.header.share}
				class="flex h-8 cursor-pointer items-center gap-1 rounded px-2 text-sm font-semibold hover:bg-brand-hover md:px-3"
			>
				<Share2 class="h-4 w-4" />
				<span class="hidden sm:inline">{config.header.share}</span>
			</button>
		</div>
	</nav>
</header>
