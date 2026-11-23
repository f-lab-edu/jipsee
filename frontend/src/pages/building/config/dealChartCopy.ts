import { buildingDealCopy } from "@/entities/building/config/buildingDealCopy";

export const dealChartCopy = {
	label: "거래 금액 점 그래프",
	jeonse: "전세",
	sale: "매매",
	renewal: buildingDealCopy.contractLabels.renewal,
	cancelled: buildingDealCopy.cancelled,
	legendNote: "월세는 목록에서 확인해요",
	countUnit: "건",
} as const;
