import type { YearMonth } from "@/shared/lib/dates/yearMonth";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

export type BuildingSummary = {
	id: number;
	name: Nullable<string>;
	address: string;
	useApprovalYear: Nullable<number>;
	// null이면 최근 12개월 동안 신규 전세가 없음
	latestNewJeonseMonth: Nullable<YearMonth>;
};
