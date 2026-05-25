<script lang="ts">
import { onMount, onDestroy } from 'svelte';
import 'maplibre-gl/dist/maplibre-gl.css';

let mapEl: HTMLDivElement;
let map: any;

const mapView = { center: [4.47917, 51.92528], zoom: 11 };

onMount(async () => {
  const maplibregl = (await import('maplibre-gl')).default;
  map = new maplibregl.Map({
    style: 'https://tiles.openfreemap.org/styles/liberty', // jouw style URL
    container: mapEl,                                       // HTML element target
    maxPitch: 0,                                            // geen 3D tilt
    center: mapView.center,
    zoom: mapView.zoom
  });

  // optionele navigatie knoppen
  map.addControl(new maplibregl.NavigationControl(), 'top-right');

  map.on('load', () => map.resize());
});

onDestroy(() => {
  map?.remove();
});
</script>

<style>
#map { width: 100%; height: 80vh; }
header { padding: 0.5rem; background: #fff; }
</style>

<header>
  <h1>Rotterdam Tijdmachine</h1>
</header>
<div id="map" bind:this={mapEl}></div>