import { dealChartCopy } from "@/pages/building/config/dealChartCopy";
import type { ChartPoint } from "@/pages/building/model/chartPoint";

/**
 * 건물 상세 > 그래프 읽기 문구
 *
 * - 전세와 매매 건수를 세어 문구 반환
 */
export function toChartLabel(points: ChartPoint[]): string {
	const jeonseCount = points.filter(
		({ dealType }) => dealType === "jeonse",
	).length;
	const saleCount = points.length - jeonseCount;

	return `${dealChartCopy.label}, ${dealChartCopy.jeonse} ${jeonseCount}${dealChartCopy.countUnit}, ${dealChartCopy.sale} ${saleCount}${dealChartCopy.countUnit}`;
}
