import { dealColumnCopy } from "@/pages/building/config/dealColumnCopy";
import { commonCopy } from "@/shared/config/commonCopy";

export const nearbyDealsCopy = {
	title: "주변 전월세 거래",
	areaLabel: dealColumnCopy.area,
	areaFixed: "이 건물 거래 면적 ±10㎡로 고정돼요",
	locationMissing:
		"이 건물은 위치 정보가 없어서 주변 거래를 보여드릴 수 없어요",
	summaryLabel: "조건에 맞는 거래",
	countUnit: "건",
	summarySuffix: "을 찾았어요",
	baseMonthSuffix: commonCopy.baseMonthSuffix,
	columns: {
		building: "건물",
		...dealColumnCopy,
	},
	noticeNone: "조건에 맞는 거래가 없어요",
	noticeBody: "반경이나 기간을 넓혀 보세요",
	confirmedDateNotice: commonCopy.confirmedDateNotice,
} as const;
