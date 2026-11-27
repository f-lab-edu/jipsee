import type { YearMonth } from "@/shared/lib/dates/yearMonth";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

// GET /buildings 응답의 data 필드
export interface BuildingSearchResponse {
	buildings: BuildingSummaryResponse[];
	hasNext: boolean;
}

export interface BuildingSummaryResponse {
	id: string;
	name: Nullable<string>;
	lotAddress: string;
	latestNewJeonseMonth: Nullable<YearMonth>;
}
