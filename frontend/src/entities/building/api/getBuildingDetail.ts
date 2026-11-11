import { buildingDetailMock } from "@/entities/building/api/buildingDetailMock";
import type { BuildingDetail } from "@/entities/building/model/buildingDetail";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

/**
 * 건물 > 상세 조회
 *
 * - id가 같은 건물이 있으면 상세 반환
 * - 없으면 null 반환
 * - 백엔드가 없어 목업이 조회를 대신함
 */
export async function getBuildingDetail(
	id: number,
): Promise<Nullable<BuildingDetail>> {
	return buildingDetailMock.find((building) => building.id === id) ?? null;
}
