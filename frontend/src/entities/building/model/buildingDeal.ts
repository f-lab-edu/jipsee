import type { YearMonth } from "@/shared/lib/dates/yearMonth";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

export type BuildingDeal = {
	id: number;
	month: YearMonth;
	type: "jeonse" | "wolse" | "sale";
	contract: Nullable<"new" | "renewal">;
	exclusiveArea: number;
	// 단위는 만원이고 전세와 월세는 보증금, 매매는 거래 금액을 담음
	amount: number;
	// 월세만 값이 있음
	monthlyRent: Nullable<number>;
	cancelled: boolean;
	similarBuilding: boolean;
};
