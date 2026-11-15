import { buildingDealCopy } from "@/entities/building/config/buildingDealCopy";

const previousBuildingLabel = "이전 건물";

export const dealChartCopy = {
	label: "거래 금액 점 그래프",
	jeonse: "전세",
	sale: "매매",
	renewal: buildingDealCopy.contractLabels.renewal,
	cancelled: buildingDealCopy.cancelled,
	similar: buildingDealCopy.similarBuilding,
	previous: previousBuildingLabel,
	legendNote: "월세는 목록에서 확인해요",
	previousBand: previousBuildingLabel,
	emptyPill: "현재 건물 거래가 없어요",
	countUnit: "건",
	noCurrentDeals: "현재 건물 거래 없음",
} as const;
