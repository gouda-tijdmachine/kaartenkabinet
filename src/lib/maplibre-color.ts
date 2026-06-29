export type RgbaExpression = ['rgba', number, number, number, number];

export const FALLBACK_BRAND_COLOR: RgbaExpression = ['rgba', 21, 128, 61, 1];

export function cssColorToRgbaExpression(value: string): RgbaExpression | undefined {
	return parseHexColor(value) ?? parseRgbColor(value) ?? parseOklchColor(value);
}

export function cssColorToHexColor(value: string): string | undefined {
	const rgbaExpression = cssColorToRgbaExpression(value);
	if (!rgbaExpression) return undefined;

	return rgbaExpressionToHexColor(rgbaExpression);
}

export function rgbaExpressionToHexColor([, red, green, blue]: RgbaExpression) {
	return `#${[red, green, blue].map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
}

function parseHexColor(value: string): RgbaExpression | undefined {
	const match = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
	if (!match) return undefined;

	const hex =
		match[1].length === 3
			? match[1]
					.split('')
					.map((channel) => channel + channel)
					.join('')
			: match[1];

	return [
		'rgba',
		Number.parseInt(hex.slice(0, 2), 16),
		Number.parseInt(hex.slice(2, 4), 16),
		Number.parseInt(hex.slice(4, 6), 16),
		1
	];
}

function parseRgbColor(value: string): RgbaExpression | undefined {
	const match = value.match(/^rgba?\((.+)\)$/i);
	if (!match) return undefined;

	const [colorPart, alphaPart] = match[1].split('/').map((part) => part.trim());
	const channels = colorPart
		.split(/[\s,]+/)
		.filter(Boolean)
		.slice(0, 3)
		.map(parseColorChannel);

	if (channels.length !== 3 || channels.some((channel) => !Number.isFinite(channel))) {
		return undefined;
	}

	return ['rgba', channels[0] ?? 0, channels[1] ?? 0, channels[2] ?? 0, parseAlpha(alphaPart)];
}

function parseOklchColor(value: string): RgbaExpression | undefined {
	const match = value.match(
		/^oklch\(\s*([^\s]+)\s+([^\s]+)\s+([^\s/]+)(?:\s*\/\s*([^)]+))?\s*\)$/i
	);
	if (!match) return undefined;

	const lightness = parsePercentageOrNumber(match[1], 1);
	const chroma = parsePercentageOrNumber(match[2], 1);
	const hue = match[3] === 'none' ? 0 : Number.parseFloat(match[3]);
	if (![lightness, chroma, hue].every(Number.isFinite)) return undefined;

	const hueRadians = (hue * Math.PI) / 180;
	const a = chroma * Math.cos(hueRadians);
	const b = chroma * Math.sin(hueRadians);
	const lPrime = lightness + 0.3963377774 * a + 0.2158037573 * b;
	const mPrime = lightness - 0.1055613458 * a - 0.0638541728 * b;
	const sPrime = lightness - 0.0894841775 * a - 1.291485548 * b;
	const l = lPrime ** 3;
	const m = mPrime ** 3;
	const s = sPrime ** 3;

	return [
		'rgba',
		linearRgbToSrgb(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
		linearRgbToSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
		linearRgbToSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
		parseAlpha(match[4])
	];
}

function parseColorChannel(value: string) {
	if (value.endsWith('%')) {
		return clamp(Math.round((Number.parseFloat(value) / 100) * 255), 0, 255);
	}

	return clamp(Math.round(Number.parseFloat(value)), 0, 255);
}

function parsePercentageOrNumber(value: string, percentScale: number) {
	if (value.endsWith('%')) {
		return (Number.parseFloat(value) / 100) * percentScale;
	}

	return Number.parseFloat(value);
}

function parseAlpha(value: string | undefined) {
	if (!value) return 1;
	if (value.endsWith('%')) return clamp(Number.parseFloat(value) / 100, 0, 1);

	const alpha = Number.parseFloat(value);
	return Number.isFinite(alpha) ? clamp(alpha, 0, 1) : 1;
}

function linearRgbToSrgb(value: number) {
	const channel = value <= 0.0031308 ? 12.92 * value : 1.055 * value ** (1 / 2.4) - 0.055;
	return clamp(Math.round(channel * 255), 0, 255);
}

function clamp(value: number, min: number, max: number) {
	return Math.min(max, Math.max(min, value));
}
