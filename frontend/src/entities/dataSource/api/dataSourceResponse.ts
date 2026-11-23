import type { YearMonth } from "@/shared/lib/dates/yearMonth";

// GET /data-sources 응답의 data 배열 원소. RENT_DEAL, SALE_DEAL 출처만 오고 수집 기록이 없는 출처는 빠짐
export interface DataSourceResponse {
	source: string;
	baseMonth: YearMonth;
}
