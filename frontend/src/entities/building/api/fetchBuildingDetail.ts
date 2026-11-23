import type { BuildingDetailResponse } from "@/entities/building/api/buildingDetailResponse";
import { toBuildingDetail } from "@/entities/building/lib/toBuildingDetail";
import type { BuildingDetailResult } from "@/entities/building/model/buildingDetailResult";
import type { ApiResponse } from "@/shared/api/apiResponse";
import { getFromBackend } from "@/shared/api/getFromBackend";
import type { ProblemDetailResponse } from "@/shared/api/problemDetailResponse";

/**
 * 건물 > 백엔드 상세 조회
 *
 * - 404이고 오류 코드가 BUILDING_NOT_FOUND이면 notFound 반환
 * - 그 밖의 2xx가 아닌 응답은 오류 발생
 * - 2xx이면 data 필드를 화면 모델로 바꿔 found 반환
 */
export async function fetchBuildingDetail(
	id: string,
): Promise<BuildingDetailResult> {
	const response = await getFromBackend(`/buildings/${encodeURIComponent(id)}`);

	if (response.status === 404) {
		const problem: ProblemDetailResponse = await response.json();

		if (problem.code === "BUILDING_NOT_FOUND") {
			return { kind: "notFound" };
		}
	}

	if (!response.ok) {
		throw new Error(`건물 상세 호출 실패: ${response.status}`);
	}

	const body: ApiResponse<BuildingDetailResponse> = await response.json();

	return { kind: "found", detail: toBuildingDetail(body) };
}
