import type { BuildingDeal } from "@/entities/building/model/buildingDeal";
import type { ChartDeal } from "@/pages/building/model/chartDeal";

/**
 * 건물 상세 > 그래프 거래 모음
 *
 * - 현재 건물 거래 다음에 이전 건물 거래를 담아 반환
 * - 월세 거래는 제외
 * - 이전 건물 거래에는 이전 건물 여부를 표시
 */
export function toChartDeals(
	deals: BuildingDeal[],
	previousDeals: BuildingDeal[],
): ChartDeal[] {
	const groups = [
		{ list: deals, fromPreviousBuilding: false },
		{ list: previousDeals, fromPreviousBuilding: true },
	];

	return groups.flatMap(({ list, fromPreviousBuilding }) =>
		list.flatMap((deal) => {
			if (deal.type === "wolse") {
				return [];
			}

			return [{ deal, dealType: deal.type, fromPreviousBuilding }];
		}),
	);
}
