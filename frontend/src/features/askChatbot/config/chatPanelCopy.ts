import { chatInputCopy } from "@/entities/chat/config/chatInputCopy";
import { pageTitleCopy } from "@/shared/config/pageTitleCopy";

export const chatPanelCopy = {
	title: chatInputCopy.prompt,
	exampleQuestions: [
		"예: ○○빌라 주변 전세 거래 알려줘",
		"예: 계약갱신요구권은 언제 쓰나요?",
	],
	login: "로그인하고 이용하기",
	compactPlaceholder: chatInputCopy.prompt,
	compactLabel: pageTitleCopy.chat,
	questionLabel: chatInputCopy.questionLabel,
	questionPlaceholder: chatInputCopy.questionPlaceholder,
	send: chatInputCopy.send,
	history: chatInputCopy.history,
} as const;
