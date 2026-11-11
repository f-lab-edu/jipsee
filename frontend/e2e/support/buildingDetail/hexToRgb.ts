/** #rrggbb를 computed style 형식인 rgb(r, g, b)로 바꿈 */
export function hexToRgb(hex: string) {
	const channel = (start: number) => parseInt(hex.slice(start, start + 2), 16);
	return `rgb(${channel(1)}, ${channel(3)}, ${channel(5)})`;
}
