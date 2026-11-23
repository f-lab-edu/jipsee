import { nearbyDealsMock } from "@/entities/building/api/nearbyDealsMock";
import type { NearbyDealsCondition } from "@/entities/building/model/nearbyDealsCondition";
import type { NearbyDealsResult } from "@/entities/building/model/nearbyDealsResult";

const PAGE_SIZE = 20;

/**
 * 건물 > 같은 법정동 주변 전월세 거래 조회
 *
 * - 조건의 유형에 맞는 거래 중 page번째 20건과 다음 페이지 유무, 전체 건수 반환
 * - 목업에 없는 건물이면 거래 없음 반환
 * - 기간은 목업이 사용하지 않음
 * - 백엔드가 없어 목업이 조회를 대신함
 *
 * @param page 0부터 시작하는 페이지 번호
 */
export async function getNearbyDeals(
	buildingId: string,
	condition: NearbyDealsCondition,
	page = 0,
): Promise<NearbyDealsResult> {
	const deals = nearbyDealsMock[buildingId]?.[condition.type] ?? [];
	const start = page * PAGE_SIZE;

	return {
		deals: deals.slice(start, start + PAGE_SIZE),
		hasNext: deals.length > start + PAGE_SIZE,
		totalCount: deals.length,
	};
}
