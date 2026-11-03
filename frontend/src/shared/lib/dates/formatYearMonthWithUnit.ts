import type { YearMonth } from "@/shared/lib/dates/yearMonth";

/**
 * 날짜 > 연월 단위 포맷
 *
 * - `YYYY년 M월` 형식의 문자열 반환
 * - 월에 0을 붙이지 않음
 */
export function formatYearMonthWithUnit(yearMonth: YearMonth): string {
	return `${yearMonth.year}년 ${yearMonth.month}월`;
}
