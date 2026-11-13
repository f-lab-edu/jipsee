import type { BuildingDeal } from "@/entities/building/model/buildingDeal";
import type { ChartMarkerKind } from "@/pages/building/model/chartMarkerKind";

/**
 * 건물 상세 > 그래프 마커 종류 결정
 *
 * - 이전 건물, 해제, 유사 건물, 갱신 순으로 먼저 맞는 종류 반환
 * - 모두 아니면 기본 종류 반환
 */
export function toChartMarkerKind(
	deal: BuildingDeal,
	fromPreviousBuilding: boolean,
): ChartMarkerKind {
	if (fromPreviousBuilding) {
		return "previous";
	}

	if (deal.cancelled) {
		return "cancelled";
	}

	if (deal.similarBuilding) {
		return "similar";
	}

	if (deal.contract === "renewal") {
		return "renewal";
	}

	return "default";
}
