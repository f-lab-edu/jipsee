import type { ChatStreamEvent } from "@/entities/chat/model/chatStreamEvent";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

/**
 * 채팅 > 스트림 이벤트 한 개 해석
 *
 * - data: 줄을 모아 줄바꿈으로 이어 JSON으로 읽어 반환
 * - data: 줄이 없거나 JSON이 아니면 null 반환
 */
export function parseChatStreamFrame(frame: string): Nullable<ChatStreamEvent> {
	const data = frame
		.split("\n")
		.filter((line) => line.startsWith("data:"))
		.map((line) => line.slice("data:".length).trim())
		.join("\n");

	if (data === "") {
		return null;
	}

	try {
		return JSON.parse(data) as ChatStreamEvent;
	} catch {
		return null;
	}
}
