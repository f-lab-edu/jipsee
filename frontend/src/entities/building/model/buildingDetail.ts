import type { BuildingDeal } from "@/entities/building/model/buildingDeal";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

export type BuildingDetail = {
	id: string;
	name: Nullable<string>;
	address: string;
	// 거래를 최신순으로 담음
	deals: BuildingDeal[];
};
