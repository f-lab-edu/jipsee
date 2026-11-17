import { normalizeChatStreamLineBreaks } from "@/entities/chat/lib/normalizeChatStreamLineBreaks";
import { parseChatStreamFrame } from "@/entities/chat/lib/parseChatStreamFrame";
import {
	idleTimeout,
	readWithIdleTimeout,
} from "@/entities/chat/lib/readWithIdleTimeout";
import type { ChatStreamEvent } from "@/entities/chat/model/chatStreamEvent";

/**
 * 채팅 > 서버 전송 이벤트 읽기
 *
 * - 빈 줄로 끝나는 이벤트마다 data: 줄을 JSON으로 읽어 반환
 * - 줄바꿈은 LF, CRLF, CR을 모두 받음
 * - 한 이벤트의 data: 줄이 여러 개이면 줄바꿈으로 이어 읽음
 * - 콜론으로 시작하는 줄(heartbeat)과 JSON이 아닌 data 줄은 건너뜀
 * - 빈 줄 없이 스트림이 끝나면 남은 이벤트도 읽음
 * - 30초 동안 바이트가 없으면 SERVER_ERROR 오류 이벤트를 반환하고 끝냄
 * - 끝나거나 중단되면 리더를 취소
 */
export async function* readChatStream(
	body: ReadableStream<Uint8Array>,
): AsyncGenerator<ChatStreamEvent> {
	const reader = body.getReader();
	const decoder = new TextDecoder();
	let buffer = "";

	try {
		while (true) {
			const result = await readWithIdleTimeout(reader);

			if (result === idleTimeout) {
				yield { type: "error", code: "SERVER_ERROR" };
				return;
			}

			let frames: string[];

			if (result.done) {
				frames = [
					normalizeChatStreamLineBreaks(buffer + decoder.decode(), true),
				];
			} else {
				frames = normalizeChatStreamLineBreaks(
					buffer + decoder.decode(result.value, { stream: true }),
					false,
				).split("\n\n");
				buffer = frames.pop() ?? "";
			}

			for (const frame of frames) {
				const event = parseChatStreamFrame(frame);

				if (event !== null) {
					yield event;
				}
			}

			if (result.done) {
				return;
			}
		}
	} finally {
		await reader.cancel().catch(() => undefined);
	}
}
