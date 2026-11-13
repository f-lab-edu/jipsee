import type { NearbyDeal } from "@/entities/building/model/nearbyDeal";

export type NearbyDealsResult =
	| { kind: "noLocation" }
	| { kind: "found"; areaConditionApplied: boolean; deals: NearbyDeal[] };
