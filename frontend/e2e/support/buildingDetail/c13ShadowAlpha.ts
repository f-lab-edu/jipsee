/** box-shadow 문자열에서 투명도를 읽음 */
export function shadowAlpha(shadow: string) {
	const m =
		String(shadow).match(/rgba\([^)]*,\s*([\d.]+)\)/) ||
		String(shadow).match(/\/\s*([\d.]+)\)/);
	return m ? Number.parseFloat(m[1] ?? "") : Number.NaN;
}
