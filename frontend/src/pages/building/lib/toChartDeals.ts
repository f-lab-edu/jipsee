import type { BuildingDeal } from "@/entities/building/model/buildingDeal";
import type { ChartDeal } from "@/pages/building/model/chartDeal";

/**
 * 건물 상세 > 그래프 거래 모음
 *
 * - 월세 거래는 제외하고 거래 유형과 함께 반환
 */
export function toChartDeals(deals: BuildingDeal[]): ChartDeal[] {
	return deals.flatMap((deal) => {
		if (deal.type === "wolse") {
			return [];
		}

		return [{ deal, dealType: deal.type }];
	});
}
