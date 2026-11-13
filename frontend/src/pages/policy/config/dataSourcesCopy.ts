export const dataSourcesCopy = {
	title: "데이터 출처",
	noticeLabel: "데이터 한계 안내",
	draftNotice: "임시로 적은 안내예요. 정식 안내가 나오면 내용이 바뀔 수 있어요",
	noticeLines: [
		"확정일자를 기준으로 수집한 거래예요. 최근 1~2개월 거래는 일부 빠져 있을 수 있어요",
		"거래가 공개되기까지 시간이 걸려 늦게 나타나는 거래도 있어요",
	],
	priceNotice: {
		prefix: "공시가격은 직접 보여 주지 않아요. ",
		linkLabel: "부동산공시가격 알리미",
		suffix: "에서 확인해 주세요",
		href: "https://www.realtyprice.kr",
	},
} as const;
