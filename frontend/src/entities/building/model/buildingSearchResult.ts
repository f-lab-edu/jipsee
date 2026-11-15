import type { BuildingSearchPage } from "@/entities/building/model/buildingSearchPage";

export type BuildingSearchResult =
	| { kind: "queryTooShort" }
	| { kind: "rateLimited" }
	| { kind: "failed" }
	| ({ kind: "found" } & BuildingSearchPage);
