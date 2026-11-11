import type { NearbyDealsMeasure } from "./measureNearbyDeals";

/** 조건 확장 안내: 확정일자 안내도 위치 정보 없음 안내도 아닌 role="note" 상자 */
export function c12Notices(m: NearbyDealsMeasure) {
	return (m.notes ?? []).filter(
		(n) =>
			!n.texts.some(
				(x) => x.t.includes("확정일자") || x.t.includes("위치 정보"),
			),
	);
}
