import type { BuildingDetail } from "@/entities/building/model/buildingDetail";

export type BuildingDetailResult =
	| { kind: "found"; detail: BuildingDetail }
	| { kind: "notFound" }
	| { kind: "rateLimited" };
