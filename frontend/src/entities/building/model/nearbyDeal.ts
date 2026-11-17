import type { DealContract } from "@/entities/building/model/dealContract";
import type { RentDealType } from "@/entities/building/model/rentDealType";
import type { YearMonth } from "@/shared/lib/dates/yearMonth";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

export type NearbyDeal = {
	id: number;
	// 행이 속한 목록의 유형
	type: RentDealType;
	buildingName: string;
	month: YearMonth;
	contract: Nullable<DealContract>;
	exclusiveArea: number;
	// 단위는 만원이고 보증금 또는 전세 금액을 담음
	amount: number;
	// 월세만 값이 있음
	monthlyRent: Nullable<number>;
};
