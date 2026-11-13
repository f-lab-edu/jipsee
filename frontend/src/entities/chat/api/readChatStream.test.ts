// @vitest-environment node
import { describe, expect, it } from "vitest";
import { readChatStream } from "@/entities/chat/api/readChatStream";
import type { ChatStreamEvent } from "@/entities/chat/model/chatStreamEvent";

function createBody(chunks: string[]): ReadableStream<Uint8Array> {
	const encoder = new TextEncoder();

	return new ReadableStream({
		start(controller) {
			for (const chunk of chunks) {
				controller.enqueue(encoder.encode(chunk));
			}
			controller.close();
		},
	});
}

async function collect(body: ReadableStream<Uint8Array>) {
	const events: ChatStreamEvent[] = [];

	for await (const event of readChatStream(body)) {
		events.push(event);
	}

	return events;
}

describe("readChatStream", () => {
	it("빈 줄로 끝나는 이벤트마다 data 줄을 읽어 차례로 반환함", async () => {
		const events = await collect(
			createBody([
				'data: {"type":"delta","text":"가"}\n\n',
				'data: {"type":"delta","text":"나"}\n\n',
			]),
		);

		expect(events).toEqual([
			{ type: "delta", text: "가" },
			{ type: "delta", text: "나" },
		]);
	});

	it("이벤트가 조각 사이에 끊겨도 이어 붙여 읽음", async () => {
		const events = await collect(
			createBody(['data: {"type":"del', 'ta","text":"가"}\n', "\n"]),
		);

		expect(events).toEqual([{ type: "delta", text: "가" }]);
	});

	it("콜론으로 시작하는 heartbeat 줄은 건너뜀", async () => {
		const events = await collect(
			createBody([': heartbeat\n\ndata: {"type":"delta","text":"가"}\n\n']),
		);

		expect(events).toEqual([{ type: "delta", text: "가" }]);
	});
});
