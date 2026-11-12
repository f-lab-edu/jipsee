import { chatMockScenario } from "@/entities/chat/api/chatMock";
import { createChatMockStream } from "@/entities/chat/api/createChatMockStream";
import { resolveChatMockIdentifier } from "@/entities/chat/api/resolveChatMockIdentifier";
import type { ChatSendRequest } from "@/entities/chat/model/chatSendRequest";

/**
 * 채팅 > 질문 전송
 *
 * - dailyLimit 시나리오이면 429와 코드 CHAT_DAILY_LIMIT 반환
 * - rateLimit 시나리오이면 429와 코드 TOO_MANY_REQUESTS 반환
 * - 그 밖에는 서버 전송 이벤트 스트림 반환
 * - 백엔드가 없어 목업이 응답을 대신함
 */
export async function postChatMessage(request: Request): Promise<Response> {
	if (chatMockScenario === "dailyLimit") {
		return Response.json({ code: "CHAT_DAILY_LIMIT" }, { status: 429 });
	}

	if (chatMockScenario === "rateLimit") {
		return Response.json({ code: "TOO_MANY_REQUESTS" }, { status: 429 });
	}

	const body = (await request.json()) as ChatSendRequest;
	const { identifier, setCookie } = await resolveChatMockIdentifier();
	const headers = new Headers({
		"content-type": "text/event-stream",
		"cache-control": "no-cache, no-transform",
	});

	if (setCookie) {
		headers.append("set-cookie", setCookie);
	}

	return new Response(createChatMockStream(identifier, body), { headers });
}
