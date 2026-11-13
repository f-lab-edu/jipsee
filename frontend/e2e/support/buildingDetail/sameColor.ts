import { parseColor } from "./parseColor";

/** 두 색이 채널당 1, 알파 0.01 이내로 같은지 비교함. 해석할 수 없으면 문자열 그대로 비교함 */
export function sameColor(
	a: string | null | undefined,
	b: string | null | undefined,
) {
	const colorA = parseColor(a);
	const colorB = parseColor(b);
	if (!colorA || !colorB) return a === b;
	return (
		Math.abs(colorA.r - colorB.r) <= 1 &&
		Math.abs(colorA.g - colorB.g) <= 1 &&
		Math.abs(colorA.b - colorB.b) <= 1 &&
		Math.abs(colorA.a - colorB.a) <= 0.01
	);
}
