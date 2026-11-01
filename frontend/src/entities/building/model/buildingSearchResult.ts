import type { BuildingSummary } from "@/entities/building/model/buildingSummary";

export type BuildingSearchResult =
	| { kind: "queryTooShort" }
	| { kind: "found"; buildings: BuildingSummary[] };
