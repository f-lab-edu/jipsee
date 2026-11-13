/** 해제와 유사 건물 배지의 고리 색. box-shadow는 "rgb(r, g, b) 0px 0px 0px 1px inset" 형태여야 함 */
export function ringOf(shadow: string) {
	const m = String(shadow).match(/^(rgba?\([^)]*\))\s+0px 0px 0px 1px inset$/);
	return m ? m[1] : null;
}
