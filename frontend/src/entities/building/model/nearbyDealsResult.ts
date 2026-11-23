import type { NearbyDeal } from "@/entities/building/model/nearbyDeal";

export type NearbyDealsResult = {
	// 요청한 페이지의 거래
	deals: NearbyDeal[];
	// true이면 다음 페이지가 있음
	hasNext: boolean;
	// 같은 조건에 맞는 전체 거래 건수
	totalCount: number;
};
