import { toMonthPercent } from "@/pages/building/lib/toMonthPercent";
import type { ChartAxis } from "@/pages/building/model/chartAxis";
import type { ChartDeal } from "@/pages/building/model/chartDeal";
import type { ChartPoint } from "@/pages/building/model/chartPoint";

/**
 * 건물 상세 > 그래프 점 위치 계산
 *
 * - 거래마다 가로 비율은 계약 월, 세로 비율은 금액으로 계산해 반환
 * - 세로 비율은 위쪽 끝이 0, 아래쪽 끝이 100
 */
export function toChartPoints(
	chartDeals: ChartDeal[],
	axis: ChartAxis,
): ChartPoint[] {
	return chartDeals.map(({ deal, dealType, fromPreviousBuilding }) => ({
		dealId: deal.id,
		fromPreviousBuilding,
		dealType,
		xPercent: toMonthPercent(deal.month, axis.startYear, axis.total),
		yPercent: ((axis.yMax - deal.amount) / (axis.yMax - axis.yMin)) * 100,
	}));
}
