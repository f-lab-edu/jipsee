import { readChatStream } from "@/entities/chat/api/readChatStream";
import type { ChatSendRequest } from "@/entities/chat/model/chatSendRequest";
import type { ChatStreamEvent } from "@/entities/chat/model/chatStreamEvent";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import { paths } from "@/shared/routes/paths";

/**
 * 채팅 > 질문 전송과 답변 스트림 읽기
 *
 * - 401이면 UNAUTHORIZED 오류 이벤트 반환
 * - 429이면 응답 코드가 CHAT_DAILY_LIMIT이면 그 코드, 그 밖에는 TOO_MANY_REQUESTS 오류 이벤트 반환
 * - 그 밖에 응답이 실패이거나 연결에 실패하면 SERVER_ERROR 오류 이벤트 반환
 * - 성공이면 스트림의 이벤트를 차례로 반환
 * - signal로 취소하면 예외를 그대로 던짐
 */
export async function* streamChatAnswer(
	request: ChatSendRequest,
	signal: AbortSignal,
): AsyncGenerator<ChatStreamEvent> {
	let response: Response;

	try {
		response = await fetch(paths.chatMessagesApi, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(request),
			signal,
		});
	} catch (error) {
		if (signal.aborted) {
			throw error;
		}

		yield { type: "error", code: "SERVER_ERROR" };
		return;
	}

	if (response.status === 401) {
		yield { type: "error", code: "UNAUTHORIZED" };
		return;
	}

	if (response.status === 429) {
		const body = (await response.json().catch(() => null)) as Nullable<{
			code?: string;
		}>;

		if (body?.code === "CHAT_DAILY_LIMIT") {
			yield { type: "error", code: "CHAT_DAILY_LIMIT" };
			return;
		}

		yield { type: "error", code: "TOO_MANY_REQUESTS" };
		return;
	}

	if (!response.ok || response.body === null) {
		yield { type: "error", code: "SERVER_ERROR" };
		return;
	}

	yield* readChatStream(response.body);
}
