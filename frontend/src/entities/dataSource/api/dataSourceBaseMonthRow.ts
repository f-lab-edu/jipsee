import type { YearMonth } from "@/shared/lib/dates/yearMonth";

export interface DataSourceBaseMonthRow {
	source: string;
	baseMonth: YearMonth;
}
