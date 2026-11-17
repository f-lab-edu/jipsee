import type { BuildingSummary } from "@/entities/building/model/buildingSummary";

export type BuildingSearchPage = {
	buildings: BuildingSummary[];
	// true이면 다음 페이지가 있음
	hasNext: boolean;
};
