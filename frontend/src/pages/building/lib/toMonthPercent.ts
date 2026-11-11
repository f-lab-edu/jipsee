import type { YearMonth } from "@/shared/lib/dates/yearMonth";

/**
 * 건물 상세 > 그래프 월 위치 변환
 *
 * - 시작 연도 1월은 0, 끝 연도 12월은 100인 비율 반환
 *
 * @param total 시작 연도 1월을 0으로 셀 때 끝 연도 12월의 순번
 */
export function toMonthPercent(
	yearMonth: YearMonth,
	startYear: number,
	total: number,
): number {
	return (
		(((yearMonth.year - startYear) * 12 + yearMonth.month - 1) / total) * 100
	);
}
