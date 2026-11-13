import { chatMockScenario } from "@/entities/chat/api/chatMock";
import type { ChatLimit } from "@/entities/chat/model/chatLimit";

/**
 * 채팅 > 한도 소진 여부 조회
 *
 * - dailyLimit 시나리오이면 소진으로 반환
 * - 백엔드가 없어 목업이 조회를 대신함
 */
export async function getChatLimit(): Promise<ChatLimit> {
	return { dailyLimitReached: chatMockScenario === "dailyLimit" };
}
