import type { MapMetadata } from '$lib/types';

export class KaartItem {
	metadata: MapMetadata;
	active: boolean;

	constructor(metadata: MapMetadata, active: boolean = false) {
		this.metadata = metadata;
		this.active = active;
	}

	// Geeft de kleur terug op basis van het jaartal
	getJaarKleur(): string {
		return this.metadata.year < 1950 ? 'text-orange-400' : 'text-blue-500';
	}
}
