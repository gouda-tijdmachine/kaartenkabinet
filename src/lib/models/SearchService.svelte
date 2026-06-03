<script module lang="ts">
	export class SearchService {
		searchTerm = $state('');
		results: any[] = $state([]);
		private timer: ReturnType<typeof setTimeout> | null = null;

		async search() {
			if (!this.searchTerm.trim()) {
				this.results = [];
				return;
			}
			const res = await fetch(
				`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(this.searchTerm)}&limit=5&countrycodes=nl`
			);
			this.results = await res.json();
		}

		searchWithDelay() {
			if (this.timer) clearTimeout(this.timer);
			this.timer = setTimeout(() => this.search(), 400);
		}

		selectLocation(result: any): [number, number] {
			this.results = [];
			this.searchTerm = result.display_name;
			return [parseFloat(result.lon), parseFloat(result.lat)];
		}
	}
</script>
