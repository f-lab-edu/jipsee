import type { YearMonth } from "@/shared/lib/dates/yearMonth";

/**
 * 날짜 > 연월 포맷
 *
 * - `YYYY.MM` 형식의 문자열 반환
 */
export function formatYearMonth(yearMonth: YearMonth): string {
	return `${yearMonth.year}.${String(yearMonth.month).padStart(2, "0")}`;
}
