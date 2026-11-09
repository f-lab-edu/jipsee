import type { C10Cond } from "./c10Fixtures";

/** 조건에 맞는 건물 상세 주소 */
export function c10NearbyHref(id: number, cond: C10Cond) {
	return `/buildings/${id}?radius=${cond.radius}&period=${cond.period}&type=${cond.type}`;
}
