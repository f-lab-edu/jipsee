import type { NearbyDealsResponse } from "@/entities/building/api/nearbyDealsResponse";
import type { NearbyDealsCondition } from "@/entities/building/model/nearbyDealsCondition";
import type { NearbyDealsResult } from "@/entities/building/model/nearbyDealsResult";
import type { ApiResponse } from "@/shared/api/apiResponse";
import { getFromBackend } from "@/shared/api/getFromBackend";

const EMPTY_RESULT: NearbyDealsResult = {
	deals: [],
	hasNext: false,
	totalCount: 0,
};

/**
 * 건물 > 백엔드 주변 전월세 거래 조회
 *
 * - 기간, 유형, 페이지를 쿼리로 보내 호출하고 페이지 크기는 서버가 정함
 * - 2xx이면 data 필드 반환
 * - 2xx가 아닌 응답과 호출 실패는 거래 없음 반환해 건물 상세 화면은 그대로 보여 줌
 *
 * @param page 0부터 시작하는 페이지 번호
 */
export async function fetchNearbyDeals(
	buildingId: string,
	condition: NearbyDealsCondition,
	page: number,
): Promise<NearbyDealsResult> {
	const query = new URLSearchParams({
		period: String(condition.period),
		type: condition.type,
		page: String(page),
	});
	let response: Response;

	try {
		response = await getFromBackend(
			`/buildings/${encodeURIComponent(buildingId)}/nearby-deals?${query}`,
		);
	} catch {
		return EMPTY_RESULT;
	}

	if (!response.ok) {
		return EMPTY_RESULT;
	}

	const body: ApiResponse<NearbyDealsResponse> = await response.json();

	return body.data;
}
