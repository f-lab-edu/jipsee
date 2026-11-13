import { createChatMockChats } from "@/entities/chat/api/createChatMockChats";
import { readChatMockUser } from "@/entities/chat/api/readChatMockUser";
import type { Chat } from "@/entities/chat/model/chat";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

/**
 * 채팅 > 대화 조회
 *
 * - 삭제한 대화이면 null 반환
 * - 질문을 더한 대화가 있으면 그 대화, 없으면 목업 대화 반환
 * - 없는 대화이면 null 반환
 * - 백엔드가 없어 목업이 조회를 대신함
 */
export async function getChat(id: number): Promise<Nullable<Chat>> {
	const user = await readChatMockUser();

	if (user.deletedIds.includes(id)) {
		return null;
	}

	const touched = user.touchedChats.find((chat) => chat.id === id);

	if (touched) {
		return touched;
	}

	return createChatMockChats(new Date()).find((chat) => chat.id === id) ?? null;
}
