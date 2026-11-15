import type { BuildingSummary } from "@/entities/building/model/buildingSummary";

export type BuildingSearchResult =
	| { kind: "queryTooShort" }
	| { kind: "rateLimited" }
	| { kind: "failed" }
	| { kind: "found"; buildings: BuildingSummary[] };
