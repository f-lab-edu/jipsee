import { chatMockScenario } from "@/entities/chat/api/chatMock";
import { createChatMockChats } from "@/entities/chat/api/createChatMockChats";
import { readChatMockUser } from "@/entities/chat/api/readChatMockUser";
import type { ChatSummary } from "@/entities/chat/model/chatSummary";

/**
 * 채팅 > 대화 목록 조회
 *
 * - noHistory 시나리오이면 빈 목록 반환
 * - 질문을 더한 대화를 앞에 두고 나머지 목업 대화를 이어서 반환하며 삭제한 대화는 뺌
 * - 백엔드가 없어 목업이 조회를 대신함
 */
export async function getChatList(): Promise<ChatSummary[]> {
	if (chatMockScenario === "noHistory") {
		return [];
	}

	const user = await readChatMockUser();
	const touchedIds = user.touchedChats.map((chat) => chat.id);
	const untouched = createChatMockChats(new Date()).filter(
		(chat) => !touchedIds.includes(chat.id),
	);

	return [...user.touchedChats, ...untouched]
		.filter((chat) => !user.deletedIds.includes(chat.id))
		.map((chat) => ({
			id: chat.id,
			title: chat.title,
			lastMessageAt: chat.lastMessageAt,
		}));
}
