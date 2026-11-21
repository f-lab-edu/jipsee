import type { NearbyDeal } from "@/entities/building/model/nearbyDeal";

export type NearbyDealsResult = {
	areaConditionApplied: boolean;
	deals: NearbyDeal[];
};
