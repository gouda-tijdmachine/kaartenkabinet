<script lang="ts">
	let { onClose }: { onClose: () => void } = $props();
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
	<div class="relative max-h-[80vh] w-[500px] overflow-y-auto rounded-xl bg-white p-8 shadow-xl">
		<button
			onclick={onClose}
			class="absolute top-3 right-3 text-xl text-gray-400 hover:text-gray-700"
		>
			✕
		</button>
		<h2 class="mb-4 text-center text-2xl font-bold">Over Roffa reis door de tijd</h2>
		<p class="mb-4 leading-relaxed text-gray-700">
			Roffa reis door de tijd maakt het mogelijk om ruim 150 jaar aan Rotterdamse
			stadsgeschiedenis te ontdekken. Vanaf de negentiende eeuw is er veel veranderd in de manier
			waarop Rotterdam zich heeft ontwikkeld als stad en haven.
		</p>
		<p class="mb-4 leading-relaxed text-gray-700">
			De historische kaarten laten zien hoe Rotterdam groeide van een kleine handelsstad tot een van
			de grootste havens ter wereld. Je ziet hoe wijken verschoven, nieuwe gebieden werden aangelegd
			en oude structuren verdwenen.
		</p>
		<p class="leading-relaxed text-gray-700">
			Deze cultuurhistorische tijdreis geeft inzicht in de keuzes die hebben geleid tot het
			Rotterdam van nu, en kan inspireren om historische kennis opnieuw te benutten.
		</p>
	</div>
</div>
