export const nearbyDealsCopy = {
	title: "주변 전월세 거래",
	areaLabel: "면적",
	areaFixed: "이 건물 거래 면적 ±10㎡로 고정돼요",
	locationMissing:
		"이 건물은 위치 정보가 없어서 주변 거래를 보여드릴 수 없어요",
	summaryLabel: "조건에 맞는 거래",
	countUnit: "건",
	summarySuffix: "을 찾았어요",
	baseMonthSuffix: "기준",
	columns: {
		building: "건물",
		type: "구분",
		contract: "계약",
		area: "면적",
		amount: "금액",
	},
	noticeNone: "조건에 맞는 거래가 없어요",
	noticeBody: "반경이나 기간을 넓혀 보세요",
	confirmedDateNotice:
		"확정일자를 기준으로 수집한 거래예요. 최근 1~2개월 거래는 일부 빠져 있을 수 있어요",
} as const;
