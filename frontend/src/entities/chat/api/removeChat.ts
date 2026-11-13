import { chatMockStore } from "@/entities/chat/api/chatMockStore";
import { resolveChatMockIdentifier } from "@/entities/chat/api/resolveChatMockIdentifier";
import { paths } from "@/shared/routes/paths";

/**
 * 채팅 > 대화 삭제
 *
 * - 삭제한 대화 목록에 더하고 질문을 더한 대화에서는 뺌
 * - 대화 목록으로 303 반환
 * - 백엔드가 없어 목업이 삭제를 대신함
 */
export async function removeChat(chatId: number): Promise<Response> {
	const { identifier, setCookie } = await resolveChatMockIdentifier();
	const user = chatMockStore.get(identifier);

	if (user) {
		user.deletedIds.push(chatId);
		user.touchedChats = user.touchedChats.filter((chat) => chat.id !== chatId);
	}

	const headers = new Headers({ location: paths.chatHistory });

	if (setCookie) {
		headers.append("set-cookie", setCookie);
	}

	return new Response(null, { status: 303, headers });
}
