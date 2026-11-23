import type { DealContract } from "@/entities/building/model/dealContract";
import type { RentDealType } from "@/entities/building/model/rentDealType";
import type { YearMonth } from "@/shared/lib/dates/yearMonth";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

// GET /buildings/{id} 응답의 data 필드. 거래는 계약 월 최신순이고 null 필드도 키를 유지함
export interface BuildingDetailResponse {
	id: string;
	name: Nullable<string>;
	address: string;
	deals: BuildingDealResponse[];
}

export interface BuildingDealResponse {
	id: number;
	month: YearMonth;
	type: RentDealType | "sale";
	contract: Nullable<DealContract>;
	exclusiveArea: number;
	amount: number;
	monthlyRent: Nullable<number>;
	cancelled: boolean;
}
