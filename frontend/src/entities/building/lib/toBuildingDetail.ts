import type { BuildingDetailResponse } from "@/entities/building/api/buildingDetailResponse";
import type { BuildingDetail } from "@/entities/building/model/buildingDetail";
import type { ApiResponse } from "@/shared/api/apiResponse";

/**
 * 건물 > 상세 응답을 화면 모델로 변환
 *
 * - data 필드를 꺼내 필드를 하나씩 옮겨 담음
 */
export function toBuildingDetail({
	data,
}: ApiResponse<BuildingDetailResponse>): BuildingDetail {
	return {
		id: data.id,
		name: data.name,
		address: data.address,
		deals: data.deals.map((deal) => ({
			id: deal.id,
			month: deal.month,
			type: deal.type,
			contract: deal.contract,
			exclusiveArea: deal.exclusiveArea,
			amount: deal.amount,
			monthlyRent: deal.monthlyRent,
			cancelled: deal.cancelled,
		})),
	};
}
