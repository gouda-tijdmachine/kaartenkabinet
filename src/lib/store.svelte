<script module lang="ts">
	export const viewState = $state({ annotation: '', opacity: 100 });

	export const flyTo = $state<{ center: [number, number] | null }>({ center: null });

	export const selectedLocation = $state<{ center: [number, number] | null }>({ center: null });

	export const mapView = $state({ center: [4.4777, 51.9244] as [number, number], zoom: 12 });

	export const comparison = $state({
		active: false,
		leftAnnotation: '',
		rightAnnotation: '',
		leftOpacity: 100,
		rightOpacity: 100
	});
</script>
