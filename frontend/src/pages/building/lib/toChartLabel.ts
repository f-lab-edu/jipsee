import { dealChartCopy } from "@/pages/building/config/dealChartCopy";
import type { ChartPoint } from "@/pages/building/model/chartPoint";

/**
 * 건물 상세 > 그래프 읽기 문구
 *
 * - 전세와 매매 건수를 세어 문구 반환
 * - 현재 건물 거래가 없으면 문구 끝에 없다는 안내 추가
 */
export function toChartLabel(
	points: ChartPoint[],
	hasCurrentDeals: boolean,
): string {
	const jeonseCount = points.filter(
		({ dealType }) => dealType === "jeonse",
	).length;
	const saleCount = points.length - jeonseCount;
	const label = `${dealChartCopy.label}, ${dealChartCopy.jeonse} ${jeonseCount}${dealChartCopy.countUnit}, ${dealChartCopy.sale} ${saleCount}${dealChartCopy.countUnit}`;

	if (hasCurrentDeals) {
		return label;
	}

	return `${label}, ${dealChartCopy.noCurrentDeals}`;
}
