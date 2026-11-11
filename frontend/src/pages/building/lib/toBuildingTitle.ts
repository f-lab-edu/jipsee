import type { BuildingDetail } from "@/entities/building/model/buildingDetail";

/**
 * 건물 상세 > 제목 변환
 *
 * - 건물 이름이 있으면 이름 반환
 * - 없으면 주소 반환
 */
export function toBuildingTitle(detail: BuildingDetail): string {
	return detail.name ?? detail.address;
}
