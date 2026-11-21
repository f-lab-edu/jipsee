import type { RentDealType } from "@/entities/building/model/rentDealType";

export type NearbyDealsCondition = {
	period: 6 | 12 | 24;
	type: RentDealType;
};
