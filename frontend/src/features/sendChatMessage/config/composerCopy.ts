import { chatInputCopy } from "@/entities/chat/config/chatInputCopy";

export const composerCopy = {
	sectionLabel: "질문 입력",
	questionLabel: chatInputCopy.questionLabel,
	questionPlaceholder: chatInputCopy.questionPlaceholder,
	send: chatInputCopy.send,
	limitLabel: "질문 한도",
	limitTitle: "오늘 질문 한도를 모두 사용했어요",
	limitDescription: "내일 다시 이용할 수 있어요",
} as const;
