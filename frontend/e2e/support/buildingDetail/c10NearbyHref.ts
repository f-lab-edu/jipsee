import type { C10Cond } from "./c10Fixtures";

/** 조건에서 일부만 바꾼 칩 링크 주소 */
export function c10NearbyHref(
	id: number,
	cond: C10Cond,
	change: Partial<C10Cond>,
) {
	const n = { ...cond, ...change };
	return `/buildings/${id}?radius=${n.radius}&period=${n.period}&type=${n.type}`;
}
