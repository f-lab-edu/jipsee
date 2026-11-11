import type { NearbyDealsMeasure } from "./measureNearbyDeals";

/** 주변 거래 섹션 안 role="note" 상자 전체 개수 */
export function c12Total(m: NearbyDealsMeasure) {
	return (m.notes ?? []).length;
}
