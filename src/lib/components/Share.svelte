<script lang="ts">
	let { onClose }: { onClose: () => void } = $props();

	let url = $state('');

	$effect(() => {
		url = window.location.href;
	});
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
	<div class="relative w-[500px] rounded-xl bg-white p-8 shadow-xl">
		<button
			onclick={onClose}
			class="absolute top-3 right-3 text-xl text-gray-400 hover:text-gray-700"
		>
			✕
		</button>
		<h2 class="mb-4 text-center text-2xl font-bold">Deel jouw rotterdam tijdmachine</h2>
		<p class="mb-6 text-center text-gray-500">Deel het kaartgedeelte dat jij nu bekijkt.</p>
		<div class="mb-6 flex gap-2">
			<input
				type="text"
				readonly
				value={url}
				class="flex-1 rounded border border-gray-300 px-3 py-2 text-sm text-gray-700"
			/>
			<button
				onclick={() => navigator.clipboard.writeText(url)}
				class="flex items-center gap-2 rounded bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700"
			>
				📋 Kopieer
			</button>
		</div>
		<div class="flex justify-center gap-6 text-2xl">
			<a href="mailto:?body={url}" class="hover:opacity-70">✉️</a>
			<a
				href="https://www.linkedin.com/sharing/share-offsite/?url={url}"
				target="_blank"
				class="hover:opacity-70"
			>
				🔗
			</a>
			<a href="https://www.reddit.com/submit?url={url}" target="_blank" class="hover:opacity-70">
				👾
			</a>
			<a href="https://wa.me/?text={url}" target="_blank" class="hover:opacity-70">💬</a>
		</div>
	</div>
</div>
