import colors from 'tailwindcss/colors';
import { cssColorToHexColor } from '$lib/maplibre-color';
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
const fontRoleVariables = {
	body: '--font-sans',
	accent: '--font-bolder',
	heading: '--font-heading',
	display: '--font-display'
} as const;
const defaultFontRoles: Record<FontRole, string> = {
	body: 'Noto Sans',
	accent: 'Noto Sans',
	heading: 'Noto Sans',
	display: 'Noto Sans'
};
const fallbackFontFamilies = ['Noto Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'];
const genericFontFamilies = new Set([
	'serif',
	'sans-serif',
	'monospace',
	'cursive',
	'fantasy',
	'system-ui',
	'ui-serif',
	'ui-sans-serif',
	'ui-monospace',
	'ui-rounded',
	'emoji',
	'math',
	'fangsong'
]);
const formatByExtension: Record<string, string> = {
	woff2: 'woff2',
	woff: 'woff',
	ttf: 'truetype',
	otf: 'opentype'
};

type ThemeShade = (typeof tailwindShades)[number];
type ThemePalette = Record<ThemeShade, string>;
type SupportedMainShade = (typeof supportedMainShades)[number];
type ThemeRole = keyof typeof themeRoles;
type FontRole = keyof typeof fontRoleVariables;
type ThemeFonts = NonNullable<AppConfig['theme']['fonts']>;
type ThemeFontFamily = NonNullable<ThemeFonts['families']>[number];
type ThemeFontFace = ThemeFontFamily['faces'][number];
type ThemeFontFile = ThemeFontFace['files'][number];
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

	const colorDeclarations = Object.entries(
		parsedTheme.type === 'custom'
			? getCustomThemeRoles(parsedTheme.color)
			: getPaletteThemeRoles(parsedTheme.color, parsedTheme.shade)
	).map(([role, color]) => `--color-brand-${role}: ${color} !important;`);

	return [...colorDeclarations, ...getFontRoleDeclarations(theme.fonts)].join(' ');
}

export function getThemeMetaColor(theme: AppConfig['theme']) {
	const parsedTheme = parseTheme(theme);
	const mainColor =
		parsedTheme.type === 'custom'
			? parsedTheme.color
			: getPaletteThemeRoles(parsedTheme.color, parsedTheme.shade).main;

	return cssColorToHexColor(mainColor) ?? mainColor;
}

export function getThemeHeadStyle(theme: AppConfig['theme']) {
	return `${getThemeFontFaceStyle(theme.fonts)}\n:root { ${getThemeStyle(theme)} }`;
}

function getFontRoleDeclarations(fonts: ThemeFonts | undefined) {
	const roles = fonts?.roles ?? {};

	return (Object.entries(fontRoleVariables) as Array<[FontRole, string]>).map(
		([role, variable]) => {
			const families = normalizeFontFamilies(roles[role] ?? defaultFontRoles[role]);
			return `${variable}: ${getFontStack(families)} !important;`;
		}
	);
}

function getThemeFontFaceStyle(fonts: ThemeFonts | undefined) {
	return (fonts?.families ?? [])
		.flatMap((family) =>
			(family.faces ?? []).map((face) => getFontFaceRule(family.name, face)).filter(Boolean)
		)
		.join('\n\n');
}

function getFontFaceRule(familyName: string, face: ThemeFontFace) {
	const sources = (face.files ?? []).map(getFontFileSource).filter(Boolean);
	if (!familyName || sources.length === 0) return '';

	const declarations = [
		`font-family: ${quoteCssString(familyName)};`,
		`src:\n\t\t${sources.join(',\n\t\t')};`,
		`font-display: ${safeFontDisplay(face.display)};`,
		`font-style: ${safeCssValue(face.style, 'normal')};`,
		`font-weight: ${safeCssValue(face.weight, '400')};`
	];

	if (face.stretch) {
		declarations.push(`font-stretch: ${safeCssValue(face.stretch, 'normal')};`);
	}

	return `@font-face {\n\t${declarations.join('\n\t')}\n}`;
}

function getFontFileSource(file: ThemeFontFile) {
	const path = typeof file === 'string' ? file : file.path;
	if (!path) return '';

	const format =
		typeof file === 'string' ? inferFontFormat(file) : (file.format ?? inferFontFormat(path));
	const formatPart = format ? ` format(${quoteCssString(format)})` : '';

	return `url(${quoteCssString(path)})${formatPart}`;
}

function inferFontFormat(path: string) {
	const extension = path.split('?')[0].split('.').pop()?.toLowerCase();
	return extension ? formatByExtension[extension] : undefined;
}

function normalizeFontFamilies(value: string | string[] | undefined) {
	const families = Array.isArray(value) ? value : String(value ?? '').split(',');
	return families.map((family) => family.trim()).filter(Boolean);
}

function getFontStack(configuredFamilies: string[]) {
	const families = configuredFamilies.length > 0 ? configuredFamilies : [defaultFontRoles.body];
	const lowerCaseFamilies = new Set(families.map((family) => family.toLowerCase()));
	const fallbackFamilies = fallbackFontFamilies.filter(
		(family) => !lowerCaseFamilies.has(family.toLowerCase())
	);

	return [...families, ...fallbackFamilies].map(formatFontFamily).join(', ');
}

function formatFontFamily(family: string) {
	return genericFontFamilies.has(family.toLowerCase()) ? family : quoteCssString(family);
}

function quoteCssString(value: string) {
	return `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, ' ')}'`;
}

function safeCssValue(value: number | string | undefined, fallback: string) {
	const normalized = String(value ?? fallback).trim();
	return /^[a-zA-Z0-9\s.%+-]+$/.test(normalized) ? normalized : fallback;
}

function safeFontDisplay(value: string | undefined) {
	const normalized = String(value ?? 'swap')
		.trim()
		.toLowerCase();
	return ['auto', 'block', 'swap', 'fallback', 'optional'].includes(normalized)
		? normalized
		: 'swap';
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
