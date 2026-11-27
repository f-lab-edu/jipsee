import type { YearMonth } from "@/shared/lib/dates/yearMonth";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

export type BuildingSummary = {
	id: string;
	name: Nullable<string>;
	lotAddress: string;
	// null이면 최근 12개월 동안 신규 전세가 없음
	latestNewJeonseMonth: Nullable<YearMonth>;
};
