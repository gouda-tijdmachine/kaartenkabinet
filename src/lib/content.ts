import type { AppConfig, MapMetadata } from '$lib/types';

const yamlModules = import.meta.glob<unknown>(
	['../../*.yml', '../../*.yaml', '../../content/*.yml', '../../content/*.yaml'],
	{
		eager: true,
		import: 'default'
	}
);

export const config = getYamlFile<AppConfig>(__APP_CONFIG_FILE__, 'config.yml', 'CONFIG');
export const collection = getYamlFile<MapMetadata[]>(
	__APP_COLLECTION_FILE__,
	'collection.yml',
	'COLLECTION'
);

function getYamlFile<T>(fileName: string | undefined, fallback: string, envName: string): T {
	const normalizedFileName = normalizeYamlFileName(fileName, fallback);
	const moduleKey = `../../${normalizedFileName}`;
	const yamlModule = yamlModules[moduleKey];

	if (!yamlModule) {
		const availableFiles = Object.keys(yamlModules)
			.map((key) => key.replace('../../', ''))
			.sort()
			.join(', ');

		throw new Error(
			`Could not load ${envName}=${normalizedFileName}. Available YAML files: ${availableFiles}`
		);
	}

	return yamlModule as T;
}

function normalizeYamlFileName(fileName: string | undefined, fallback: string) {
	const normalized = (fileName?.trim() || fallback)
		.replace(/\\/g, '/')
		.replace(/^\.\//, '')
		.replace(/^\/+/, '');

	if (normalized.startsWith('../')) {
		throw new Error(`Content file paths must stay inside the project: ${normalized}`);
	}

	return normalized;
}
