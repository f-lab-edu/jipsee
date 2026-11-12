import { cookies } from "next/headers";
import {
	chatMockCookieName,
	chatMockStore,
} from "@/entities/chat/api/chatMockStore";

/**
 * 채팅 > 목업 식별자 정하기
 *
 * - 쿠키에 식별자가 있고 저장된 상태가 있으면 그대로 반환
 * - 그 밖에는 새 식별자와 빈 상태를 만들어 저장하고 쿠키 설정 값을 함께 반환
 *
 * @returns setCookie는 새로 만들었을 때만 있음
 */
export async function resolveChatMockIdentifier(): Promise<{
	identifier: string;
	setCookie?: string;
}> {
	const store = await cookies();
	const existing = store.get(chatMockCookieName)?.value;

	if (existing !== undefined && chatMockStore.has(existing)) {
		return { identifier: existing };
	}

	const identifier = existing ?? crypto.randomUUID();
	chatMockStore.set(identifier, { deletedIds: [], touchedChats: [] });

	return {
		identifier,
		setCookie: `${chatMockCookieName}=${identifier}; Path=/; HttpOnly; SameSite=Lax`,
	};
}
