import { toMonthPercent } from "@/pages/building/lib/toMonthPercent";
import type { ChartAxis } from "@/pages/building/model/chartAxis";
import type { ChartDeal } from "@/pages/building/model/chartDeal";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

const amountMargin = 1000;
const amountStep = 2000;

/**
 * 건물 상세 > 그래프 축 계산
 *
 * - 점을 그릴 거래가 없으면 null 반환
 * - 세로축은 금액 최솟값과 최댓값에 1,000씩 여유를 둔 뒤 2,000 단위로 내림과 올림
 * - 가로축 시작 연도는 가장 이른 거래의 연도
 * - 눈금 간격은 연도 폭이 5 이하이면 1년, 10 이하이면 2년, 그 이상이면 3년
 *
 * @param endYear 가로축 끝 연도. 실거래 기준 월의 연도
 */
export function toChartAxis(
	chartDeals: ChartDeal[],
	endYear: number,
): Nullable<ChartAxis> {
	if (chartDeals.length === 0) {
		return null;
	}

	const amounts = chartDeals.map(({ deal }) => deal.amount);
	const yMin =
		Math.floor((Math.min(...amounts) - amountMargin) / amountStep) * amountStep;
	const yMax =
		Math.ceil((Math.max(...amounts) + amountMargin) / amountStep) * amountStep;
	const startYear = Math.min(...chartDeals.map(({ deal }) => deal.month.year));
	const yearWidth = endYear - startYear + 1;
	const total = yearWidth * 12 - 1;

	let tickInterval = 3;
	if (yearWidth <= 10) {
		tickInterval = 2;
	}
	if (yearWidth <= 5) {
		tickInterval = 1;
	}

	const xTicks: ChartAxis["xTicks"] = [];
	for (let year = startYear; year <= endYear; year += tickInterval) {
		xTicks.push({
			year,
			xPercent: toMonthPercent({ year, month: 1 }, startYear, total),
		});
	}

	return {
		startYear,
		endYear,
		total,
		yMin,
		yMax,
		yLabels: [yMax, (yMax + yMin) / 2, yMin],
		xTicks,
	};
}
