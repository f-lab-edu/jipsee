import { buildingDetailMock } from "@/entities/building/api/buildingDetailMock";
import type { BuildingDetailResponse } from "@/entities/building/api/buildingDetailResponse";
import type { ApiResponse } from "@/shared/api/apiResponse";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

/**
 * 건물 > 상세 목업 조회
 *
 * - id가 같은 건물이 있으면 백엔드 응답과 같은 형태로 반환
 * - 없으면 null 반환
 */
export function findBuildingDetailMock(
	id: string,
): Nullable<ApiResponse<BuildingDetailResponse>> {
	const detail = buildingDetailMock.find((building) => building.id === id);

	if (detail === undefined) {
		return null;
	}

	return { data: detail };
}
