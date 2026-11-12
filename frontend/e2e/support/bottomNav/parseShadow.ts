/** 계산된 box-shadow 한 줄("색 x y blur spread")을 색과 숫자로 나눔 */
export function parseShadow(value: string) {
	const match = value.match(
		/^(.+?) (-?[\d.]+)px (-?[\d.]+)px (-?[\d.]+)px (-?[\d.]+)px$/,
	);
	if (!match) {
		throw new Error(`box-shadow를 해석할 수 없음: ${value}`);
	}
	return {
		color: match[1],
		x: Number(match[2]),
		y: Number(match[3]),
		blur: Number(match[4]),
		spread: Number(match[5]),
	};
}
