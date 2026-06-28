import { layers, namedFlavor, type Flavor } from '@protomaps/basemaps';
import type { StyleSpecification } from 'maplibre-gl';

type ProtomapsFlavor = 'light' | 'dark' | 'white' | 'grayscale' | 'black';
type LayersOptions = {
	labelsOnly?: boolean;
	lang?: string;
};

const backgroundColors: Record<ProtomapsFlavor, string> = {
	light: '#cccccc',
	dark: '#34373d',
	white: '#ffffff',
	grayscale: '#a3a3a3',
	black: '#2b2b2b'
};

export function getProtomapsLayers(
	flavor: ProtomapsFlavor = 'light',
	flavorOverrides?: Flavor,
	options?: LayersOptions
) {
	// Exclude some layers
	const layerIdsToExclude = ['pois', 'roads_shields', 'roads_oneway'];
	const customFlavor = { ...namedFlavor(flavor), ...flavorOverrides };
	const styleLayers = layers('protomaps', customFlavor, options) as StyleSpecification['layers'];
	return styleLayers.filter(({ id }) => !layerIdsToExclude.includes(id));
}

export function getProtomapsStyle(
	flavor: ProtomapsFlavor = 'light',
	apiKey: string
): StyleSpecification {
	return {
		version: 8,
		glyphs: 'https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf',
		sprite: `https://protomaps.github.io/basemaps-assets/sprites/v4/${flavor}`,
		sources: {
			protomaps: {
				attribution:
					'<a href="https://github.com/protomaps/basemaps">Protomaps</a> © <a href="https://openstreetmap.org">OpenStreetMap</a>',
				type: 'vector',
				url: `https://api.protomaps.com/tiles/v4.json?key=${encodeURIComponent(apiKey)}`,
				maxzoom: 15
			}
		},
		layers: [
			{
				id: 'foreground',
				type: 'background',
				paint: {
					'background-color': backgroundColors[flavor],
					'background-opacity': 0
				}
			}
		]
	};
}
