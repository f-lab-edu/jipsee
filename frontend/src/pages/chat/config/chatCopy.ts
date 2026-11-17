import { chatInputCopy } from "@/entities/chat/config/chatInputCopy";
import { commonCopy } from "@/shared/config/commonCopy";
import { pageTitleCopy } from "@/shared/config/pageTitleCopy";

const historyListTitle = "대화 목록";
const buildingExampleQuestion = "전입신고는 언제 해야 해?";

export const chatCopy = {
	title: pageTitleCopy.chat,
	historyTitle: historyListTitle,
	historyLabel: historyListTitle,
	historyButton: "목록",
	newChat: "새 대화",
	buildingChip: "기준",
	emptyTitle: chatInputCopy.prompt,
	exampleQuestions: [
		"○○빌라 주변 전세 거래 알려줘",
		"계약갱신요구권은 언제 쓰나요?",
		buildingExampleQuestion,
	],
	buildingExampleQuestions: [
		"이 건물 최근 2년 전세 거래 알려줘",
		buildingExampleQuestion,
	],
	threadLabel: "대화 내용",
	retry: commonCopy.retry,
	errorMessages: {
		TOO_MANY_REQUESTS: "요청이 많아요. 잠시 후 다시 시도해 주세요",
		SERVER_ERROR: commonCopy.temporaryError,
	},
	historyListLabel: chatInputCopy.history,
	historyEmpty: "지난 대화가 없어요",
} as const;
