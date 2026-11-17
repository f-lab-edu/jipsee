import type { ChatMockScenario } from "@/entities/chat/api/chatMockScenario";
import { readMockSetting } from "@/shared/lib/mock/readMockSetting";

/**
 * 채팅 > 목업 시나리오 조회
 *
 * - 쿠키 jipsee-mock-chat 또는 환경 변수 MOCK_CHAT의 값으로 결정
 * - 값이 없거나 알 수 없으면 normal 반환
 * - 운영 빌드에서는 항상 normal 반환
 */
export async function readChatMockScenario(): Promise<ChatMockScenario> {
	const scenario = await readMockSetting<ChatMockScenario>({
		cookieName: "jipsee-mock-chat",
		envValue: process.env.MOCK_CHAT,
		values: ["normal", "dailyLimit", "serverError", "rateLimit", "noHistory"],
	});

	return scenario ?? "normal";
}
