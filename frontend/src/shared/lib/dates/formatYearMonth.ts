import type { YearMonth } from "@/shared/lib/dates/yearMonth";

/** 연월을 `YYYY.MM` 형식의 문자열로 반환함 */
export function formatYearMonth(yearMonth: YearMonth): string {
	return `${yearMonth.year}.${String(yearMonth.month).padStart(2, "0")}`;
}
