export type Rgba = { r: number; g: number; b: number; a: number };

/** rgb(), rgba(), color(srgb ...) 문자열을 0~255 범위의 rgba로 바꿈 */
export function parseColor(value: string | null | undefined): Rgba | null {
	const text = String(value).trim();
	const rgb = text.match(/^rgba?\(([^)]+)\)$/);
	if (rgb) {
		const p = rgb[1]
			.split(/[,\s/]+/)
			.filter(Boolean)
			.map(Number);
		return { r: p[0], g: p[1], b: p[2], a: p[3] ?? 1 };
	}
	const srgb = text.match(/^color\(srgb ([^)]+)\)$/);
	if (srgb) {
		const p = srgb[1]
			.split(/[\s/]+/)
			.filter(Boolean)
			.map(Number);
		return { r: p[0] * 255, g: p[1] * 255, b: p[2] * 255, a: p[3] ?? 1 };
	}
	return null;
}
