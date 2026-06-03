import type { MapMetadata } from "$lib/types";

const maps: MapMetadata[] = [
	{
		label: 'Nieuwe platte grond der stad Rotterdam',
		title:
			'Nieuwe platte grond der stad Rotterdam, gelegen aan de rivieren de Maas en de Rotte, met al de publique en kerkelijke gebouwen binnen dezelve staande...',
		year: 1800,
		institution: 'Universiteitsbibliotheek Utrecht',
		url: 'https://objects.library.uu.nl/reader/1874-351963',
		iiif: {
			url: 'https://objects.library.uu.nl/manifest/iiif/v3/1874-351963',
			type: 'Manifest'
		},
		annotation: 'https://annotations.allmaps.org/maps/f216cd0b2a7c8a27'
	},
	{
		label: 'Kadastrale kaart 1811-1832',
		title: 'Kadastrale kaart 1811-1832: verzamelplan Rotterdam, Zuid Holland (MIN08176VK1)',
		year: 1832,
		institution: 'Rijksdienst voor Cultureel Erfgoed',
		url: 'https://beeldbank.cultureelerfgoed.nl/rce-mediabank/detail/997b860c-94d7-11e5-ab73-537ceda9f6ff/media/18995fd8-5a34-ee7a-31d6-c1bb0b610186?mode=detail&view=horizontal&q=MIN08176VK1&rows=1&page=1&fq%5B%5D=search_s_entity_name:%22Kadastrale%20kaarten%22&filterAction',
		iiif: {
			url: 'https://sammeltassen.nl/iiif-manifests/rce/minuutplan-rotterdam.json',
			type: 'Manifest'
		},
		annotation: 'https://annotations.allmaps.org/manifests/7256050d27d1f599'
	},
	{
		label: 'Plattegrond van Rotterdam in 10 bladen',
		title: 'Plattegrond van Rotterdam in 10 bladen',
		year: 1897,
		institution: 'Stadsarchief Rotterdam',
		url: 'https://proxy.archieven.nl/0/D4819B84C353472E82C51412132084C8',
		annotation: 'https://sammeltassen.nl/iiif-manifests/allmaps/rotterdam-1897.json'
	},
	{
		label: 'Basisplan en Bestemmingen binnenstad Rotterdam',
		title: '245 - Basisplan en Bestemmingen binnenstad Rotterdam. Z.n. Z.p.',
		year: 1946,
		institution: 'Nationaal Archief',
		url: 'https://www.nationaalarchief.nl/onderzoeken/archief/4.ZHPB1/invnr/245/file/NL-HaNA_4.ZHPB1_245_0001',
		iiif: {
			url: 'https://service.archief.nl/iipsrv?IIIF=/d8/47/27/f5/e1/fb/45/8b/b4/b5/38/b8/c1/c3/eb/1a/2d2b7cdd-4687-417a-8bea-95c2f62347d5.jp2',
			type: 'image'
		},
		annotation: 'https://annotations.allmaps.org/images/fe1800c9d37d381c'
	},
	{
		label: 'Kaart van het centrum van Rotterdam voor mei 1940',
		title: 'Kaart van het centrum van Rotterdam voor mei 1940',
		year: 1940,
		institution: 'Stadsarchief Rotterdam',
		url: 'https://observablehq.com/@ambassadors/geographical-features-imports',
		annotation: 'https://annotations.allmaps.org/images/3429af1e1e579426'
	}
];

export default maps;
