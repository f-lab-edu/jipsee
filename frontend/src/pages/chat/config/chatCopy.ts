export const chatCopy = {
	title: "집사",
	historyTitle: "대화 목록",
	historyLabel: "대화 목록",
	historyButton: "목록",
	newChat: "새 대화",
	buildingChip: "기준",
	emptyTitle: "집사에게 궁금한 점을 물어보세요",
	exampleQuestions: [
		"○○빌라 주변 전세 거래 알려줘",
		"계약갱신요구권은 언제 쓰나요?",
		"전입신고는 언제 해야 해?",
	],
	buildingExampleQuestions: [
		"이 건물 최근 2년 전세 거래 알려줘",
		"전입신고는 언제 해야 해?",
	],
	threadLabel: "대화 내용",
	retry: "다시 시도",
	errorMessages: {
		TOO_MANY_REQUESTS: "요청이 많아요. 잠시 후 다시 시도해 주세요",
		SERVER_ERROR: "일시적인 오류가 발생했어요",
	},
	historyListLabel: "지난 대화",
	historyEmpty: "지난 대화가 없어요",
} as const;
