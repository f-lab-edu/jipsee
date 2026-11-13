import type { ChatStreamEvent } from "@/entities/chat/model/chatStreamEvent";

/**
 * 채팅 > 서버 전송 이벤트 읽기
 *
 * - 빈 줄로 끝나는 이벤트마다 data: 줄을 JSON으로 읽어 반환
 * - 콜론으로 시작하는 줄(heartbeat)은 건너뜀
 */
export async function* readChatStream(
	body: ReadableStream<Uint8Array>,
): AsyncGenerator<ChatStreamEvent> {
	const reader = body.getReader();
	const decoder = new TextDecoder();
	let buffer = "";

	while (true) {
		const { done, value } = await reader.read();

		if (done) {
			return;
		}

		buffer += decoder.decode(value, { stream: true });
		const frames = buffer.split("\n\n");
		buffer = frames.pop() ?? "";

		for (const frame of frames) {
			const data = frame
				.split("\n")
				.filter((line) => line.startsWith("data:"))
				.map((line) => line.slice("data:".length).trim())
				.join("");

			if (data !== "") {
				yield JSON.parse(data) as ChatStreamEvent;
			}
		}
	}
}
