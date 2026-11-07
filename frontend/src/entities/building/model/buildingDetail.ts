import type { BuildingDeal } from "@/entities/building/model/buildingDeal";
import type { BuildingDong } from "@/entities/building/model/buildingDong";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

export type BuildingDetail = {
	id: number;
	name: Nullable<string>;
	address: string;
	dongs: BuildingDong[];
	// 현재 건물의 거래를 최신순으로 담음
	deals: BuildingDeal[];
	// 이전 건물의 거래를 최신순으로 담음
	previousDeals: BuildingDeal[];
};
