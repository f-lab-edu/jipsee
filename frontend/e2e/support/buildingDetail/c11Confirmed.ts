import type { NearbyDealsMeasure } from "./measureNearbyDeals";

/** 주변 거래 섹션에서 "확정일자" 문구가 있는 안내 상자 */
export function c11Confirmed(m: NearbyDealsMeasure) {
	return (m.notes ?? []).filter((n) =>
		n.texts.some((x) => x.t.includes("확정일자")),
	);
}
