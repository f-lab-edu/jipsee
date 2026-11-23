import { nearbyDealsMock } from "@/entities/building/api/nearbyDealsMock";
import type { NearbyDealsCondition } from "@/entities/building/model/nearbyDealsCondition";
import type { NearbyDealsResult } from "@/entities/building/model/nearbyDealsResult";

/**
 * 건물 > 같은 법정동 주변 전월세 거래 조회
 *
 * - 조건의 유형에 맞는 거래 목록 반환
 * - 목업에 없는 건물이면 거래 없음 반환
 * - 기간은 목업이 사용하지 않음
 * - 백엔드가 없어 목업이 조회를 대신함
 */
export async function getNearbyDeals(
	buildingId: string,
	condition: NearbyDealsCondition,
): Promise<NearbyDealsResult> {
	const nearby = nearbyDealsMock[buildingId];

	if (!nearby) {
		return { areaConditionApplied: false, deals: [] };
	}

	return {
		areaConditionApplied: nearby.areaConditionApplied,
		deals: nearby.deals[condition.type],
	};
}
