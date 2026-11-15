import type { BuildingSearchPage } from "@/entities/building/model/buildingSearchPage";

export type BuildingSearchResult =
	| { kind: "queryTooShort" }
	| ({ kind: "found" } & BuildingSearchPage);
