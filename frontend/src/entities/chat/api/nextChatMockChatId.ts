import { chatMockStore } from "@/entities/chat/api/chatMockStore";

const baseChatCount = 5;

/**
 * 채팅 > 목업 새 대화 번호 정하기
 *
 * - 목업 대화, 질문을 더한 대화, 삭제한 대화 번호보다 큰 값 반환
 */
export function nextChatMockChatId(identifier: string): number {
	const user = chatMockStore.get(identifier);
	const usedIds = [
		baseChatCount,
		...(user?.touchedChats.map((chat) => chat.id) ?? []),
		...(user?.deletedIds ?? []),
	];

	return Math.max(...usedIds) + 1;
}
