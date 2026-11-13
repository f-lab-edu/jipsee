import { cookies } from "next/headers";
import {
	chatMockCookieName,
	chatMockStore,
} from "@/entities/chat/api/chatMockStore";
import type { ChatMockUser } from "@/entities/chat/model/chatMockUser";

/**
 * 채팅 > 목업 사용자 상태 조회
 *
 * - 쿠키의 식별자로 저장된 상태 반환
 * - 쿠키나 저장된 상태가 없으면 삭제한 대화도 질문을 더한 대화도 없는 상태 반환
 */
export async function readChatMockUser(): Promise<ChatMockUser> {
	const store = await cookies();
	const identifier = store.get(chatMockCookieName)?.value;

	if (identifier === undefined) {
		return { deletedIds: [], touchedChats: [] };
	}

	return chatMockStore.get(identifier) ?? { deletedIds: [], touchedChats: [] };
}
