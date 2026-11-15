import { chatMockStore } from "@/entities/chat/api/chatMockStore";
import { resolveChatMockIdentifier } from "@/entities/chat/api/resolveChatMockIdentifier";

/**
 * 채팅 > 대화 삭제
 *
 * - 삭제한 대화 목록에 더하고 질문을 더한 대화에서는 뺌
 * - 백엔드가 없어 목업이 삭제를 대신함
 *
 * @returns setCookie는 목업이 식별자를 새로 만들었을 때만 있음
 */
export async function removeChat(
	chatId: number,
): Promise<{ setCookie?: string }> {
	const { identifier, setCookie } = await resolveChatMockIdentifier();
	const user = chatMockStore.get(identifier);

	if (user) {
		user.deletedIds.push(chatId);
		user.touchedChats = user.touchedChats.filter((chat) => chat.id !== chatId);
	}

	return { setCookie };
}
