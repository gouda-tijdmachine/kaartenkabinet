import colors from 'tailwindcss/colors';
import type { AppConfig } from '$lib/types';

const tailwindShades = [
	'50',
	'100',
	'200',
	'300',
	'400',
	'500',
	'600',
	'700',
	'800',
	'900',
	'950'
] as const;
const supportedMainShades = ['400', '500', '600', '700', '800'] as const;
const themeRoles = {
	soft: -7,
	muted: -6,
	secondary: -1,
	main: 0,
	hover: 1
} as const;
const minimumRoleIndices: Partial<Record<keyof typeof themeRoles, number>> = {
	muted: 1
};

type ThemeShade = (typeof tailwindShades)[number];
type ThemePalette = Record<ThemeShade, string>;
type SupportedMainShade = (typeof supportedMainShades)[number];

function isThemePalette(value: unknown): value is ThemePalette {
	if (!value || typeof value !== 'object') return false;

	return tailwindShades.every(
		(shade) => typeof (value as Record<string, unknown>)[shade] === 'string'
	);
}

function parseTheme(theme: AppConfig['theme']) {
	const colorValue = theme.color?.trim().toLowerCase() || 'green';
	const colorMatch = colorValue.match(/^([a-z]+)-(\d{2,3})$/);
	const color = colorMatch?.[1] ?? colorValue;
	const shade = normalizeShade(theme.shade) ?? normalizeShade(colorMatch?.[2]) ?? '700';

	return { color, shade };
}

function normalizeShade(shade: number | string | undefined): SupportedMainShade | undefined {
	const normalized = String(shade ?? '').trim();
	return supportedMainShades.includes(normalized as SupportedMainShade)
		? (normalized as SupportedMainShade)
		: undefined;
}

function getThemePalette(color: string | undefined) {
	const palette = (colors as Record<string, unknown>)[color || 'green'];
	return isThemePalette(palette) ? palette : (colors.green as ThemePalette);
}

export function getThemeStyle(theme: AppConfig['theme']) {
	const { color, shade } = parseTheme(theme);
	const palette = getThemePalette(color);
	const roleEntries = Object.entries(themeRoles) as Array<[keyof typeof themeRoles, number]>;

	return roleEntries
		.map(([role, offset]) => {
			const roleShade = getRelativeShade(shade, offset, minimumRoleIndices[role]);
			return `--color-brand-${role}: ${palette[roleShade]} !important;`;
		})
		.join(' ');
}

function getRelativeShade(shade: SupportedMainShade, offset: number, minimumIndex = 0) {
	const index = tailwindShades.indexOf(shade);
	const nextIndex = Math.max(minimumIndex, Math.min(tailwindShades.length - 1, index + offset));

	return tailwindShades[nextIndex];
}
