import type { YearMonth } from "@/shared/lib/dates/yearMonth";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

export interface DataSourceCardItem {
	source: string;
	name: string;
	provider: string;
	updateCycle: string;
	baseMonth: Nullable<YearMonth>;
	originalUrl: string;
}
