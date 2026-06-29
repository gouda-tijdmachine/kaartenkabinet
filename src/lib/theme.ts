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
const white = '#ffffff';
const black = '#000000';
const customThemeRoleMixes = {
	soft: { color: white, amount: 0.94 },
	muted: { color: white, amount: 0.8 },
	secondary: { color: white, amount: 0.14 },
	hover: { color: black, amount: 0.17 }
} as const;

type ThemeShade = (typeof tailwindShades)[number];
type ThemePalette = Record<ThemeShade, string>;
type SupportedMainShade = (typeof supportedMainShades)[number];
type ThemeRole = keyof typeof themeRoles;
type ParsedTheme =
	| {
			type: 'custom';
			color: string;
	  }
	| {
			type: 'palette';
			color: string;
			shade: SupportedMainShade;
	  };

function isThemePalette(value: unknown): value is ThemePalette {
	if (!value || typeof value !== 'object') return false;

	return tailwindShades.every(
		(shade) => typeof (value as Record<string, unknown>)[shade] === 'string'
	);
}

function parseTheme(theme: AppConfig['theme']): ParsedTheme {
	const colorValue = String(theme.color ?? '')
		.trim()
		.toLowerCase();
	const colorMatch = colorValue.match(/^([a-z]+)-(\d{2,3})$/);
	const customColor = normalizeCustomColor(colorValue);
	const color = colorMatch?.[1] ?? colorValue;
	const shade = normalizeShade(theme.shade) ?? normalizeShade(colorMatch?.[2]) ?? '700';

	if (customColor) {
		return { type: 'custom', color: customColor };
	}

	return { type: 'palette', color: color || 'green', shade };
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
	const parsedTheme = parseTheme(theme);

	return Object.entries(
		parsedTheme.type === 'custom'
			? getCustomThemeRoles(parsedTheme.color)
			: getPaletteThemeRoles(parsedTheme.color, parsedTheme.shade)
	)
		.map(([role, color]) => `--color-brand-${role}: ${color} !important;`)
		.join(' ');
}

function getPaletteThemeRoles(color: string, shade: SupportedMainShade): Record<ThemeRole, string> {
	const palette = getThemePalette(color);
	const roleEntries = Object.entries(themeRoles) as Array<[ThemeRole, number]>;

	return Object.fromEntries(
		roleEntries.map(([role, offset]) => {
			const roleShade = getRelativeShade(shade, offset, minimumRoleIndices[role]);
			return [role, palette[roleShade]];
		})
	) as Record<ThemeRole, string>;
}

function getCustomThemeRoles(color: string): Record<ThemeRole, string> {
	return {
		soft: mixHexColors(color, customThemeRoleMixes.soft.color, customThemeRoleMixes.soft.amount),
		muted: mixHexColors(color, customThemeRoleMixes.muted.color, customThemeRoleMixes.muted.amount),
		secondary: mixHexColors(
			color,
			customThemeRoleMixes.secondary.color,
			customThemeRoleMixes.secondary.amount
		),
		main: color,
		hover: mixHexColors(color, customThemeRoleMixes.hover.color, customThemeRoleMixes.hover.amount)
	};
}

function getRelativeShade(shade: SupportedMainShade, offset: number, minimumIndex = 0) {
	const index = tailwindShades.indexOf(shade);
	const nextIndex = Math.max(minimumIndex, Math.min(tailwindShades.length - 1, index + offset));

	return tailwindShades[nextIndex];
}

function normalizeCustomColor(color: string) {
	return normalizeHexColor(color) ?? normalizeRgbColor(color);
}

function normalizeHexColor(color: string) {
	const match = color.match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
	if (!match) return undefined;

	const value = match[1].toLowerCase();
	if (value.length === 3) {
		return `#${value
			.split('')
			.map((character) => character + character)
			.join('')}`;
	}

	return `#${value}`;
}

function normalizeRgbColor(color: string) {
	const match = color.match(/^rgb\(\s*(.+?)\s*\)$/i);
	if (!match) return undefined;

	const components = match[1].includes(',')
		? match[1].split(',').map((component) => component.trim())
		: match[1].trim().split(/\s+/);
	if (components.length !== 3) return undefined;

	const rgb = components.map(parseRgbComponent);
	if (!rgb.every((component) => component !== undefined)) return undefined;

	return rgbToHex(rgb as [number, number, number]);
}

function parseRgbComponent(component: string) {
	if (component.endsWith('%')) {
		const percentage = Number(component.slice(0, -1));
		return Number.isFinite(percentage)
			? clampRgbChannel(Math.round((percentage / 100) * 255))
			: undefined;
	}

	const value = Number(component);
	return Number.isFinite(value) ? clampRgbChannel(Math.round(value)) : undefined;
}

function mixHexColors(color: string, mixColor: string, amount: number) {
	const colorRgb = hexToRgb(color);
	const mixRgb = hexToRgb(mixColor);

	return rgbToHex(
		colorRgb.map((channel, index) =>
			Math.round(channel * (1 - amount) + mixRgb[index] * amount)
		) as [number, number, number]
	);
}

function hexToRgb(color: string): [number, number, number] {
	return [1, 3, 5].map((start) => Number.parseInt(color.slice(start, start + 2), 16)) as [
		number,
		number,
		number
	];
}

function clampRgbChannel(value: number) {
	return Math.max(0, Math.min(255, value));
}

function rgbToHex(rgb: [number, number, number]) {
	return `#${rgb
		.map((channel) => clampRgbChannel(channel).toString(16).padStart(2, '0'))
		.join('')}`;
}
