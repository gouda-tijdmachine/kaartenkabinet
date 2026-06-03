import type { MapMetadata } from '$lib/types';
import maps from '$lib/content/data';

export class MapCard {
	metadata: MapMetadata;

	constructor(metadata: MapMetadata) {
		this.metadata = metadata;
	}

	getYearColor(): string {
		const year = this.metadata.year;
		if (year < 1850) return 'text-orange-500';
		if (year < 1900) return 'text-yellow-500';
		if (year < 1940) return 'text-blue-500';
		return 'text-green-600';
	}
}

export class MapCollection {
	private cards: MapCard[];

	constructor() {
		this.cards = maps.map((m) => new MapCard(m));
	}

	getAllMaps(): MapCard[] {
		return this.cards;
	}
}
