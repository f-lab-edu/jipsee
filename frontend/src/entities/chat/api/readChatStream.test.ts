// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
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

	it("CRLF로 끝나는 이벤트도 읽음", async () => {
		const events = await collect(
			createBody([
				'data: {"type":"delta","text":"가"}\r\n\r\n',
				'data: {"type":"delta","text":"나"}\r\n\r\n',
			]),
		);

		expect(events).toEqual([
			{ type: "delta", text: "가" },
			{ type: "delta", text: "나" },
		]);
	});

	it("CRLF가 조각 사이에 끊겨도 한 번만 나눔", async () => {
		const events = await collect(
			createBody([
				'data: {"type":"delta","text":"가"}\r\n\r',
				'\ndata: {"type":"delta","text":"나"}\r\n\r\n',
			]),
		);

		expect(events).toEqual([
			{ type: "delta", text: "가" },
			{ type: "delta", text: "나" },
		]);
	});

	it("빈 줄 없이 스트림이 끝나도 마지막 이벤트를 읽음", async () => {
		const events = await collect(
			createBody([
				'data: {"type":"delta","text":"가"}\n\n',
				'data: {"type":"delta","text":"나"}',
			]),
		);

		expect(events).toEqual([
			{ type: "delta", text: "가" },
			{ type: "delta", text: "나" },
		]);
	});

	it("한 이벤트의 data 줄이 여러 개이면 줄바꿈으로 이어 읽음", async () => {
		const events = await collect(
			createBody(['data: {"type":"delta",\ndata: "text":"가"}\n\n']),
		);

		expect(events).toEqual([{ type: "delta", text: "가" }]);
	});

	it("JSON이 아닌 data 줄은 건너뜀", async () => {
		const events = await collect(
			createBody(["data: ping\n\n", 'data: {"type":"delta","text":"가"}\n\n']),
		);

		expect(events).toEqual([{ type: "delta", text: "가" }]);
	});

	it("끝나면 리더를 취소함", async () => {
		const cancel = vi.fn();
		const body = new ReadableStream<Uint8Array>({
			start(controller) {
				controller.enqueue(
					new TextEncoder().encode('data: {"type":"delta","text":"가"}\n\n'),
				);
			},
			cancel,
		});
		const iterator = readChatStream(body);

		await iterator.next();
		await iterator.return(undefined);

		expect(cancel).toHaveBeenCalledTimes(1);
	});

	describe("바이트가 오지 않을 때", () => {
		afterEach(() => {
			vi.useRealTimers();
		});

		it("30초 동안 바이트가 없으면 서버 오류 이벤트를 반환하고 리더를 취소함", async () => {
			vi.useFakeTimers();
			const cancel = vi.fn();
			const body = new ReadableStream<Uint8Array>({ cancel });
			const result = collect(body);

			await vi.advanceTimersByTimeAsync(29_999);
			expect(cancel).not.toHaveBeenCalled();
			await vi.advanceTimersByTimeAsync(1);

			expect(await result).toEqual([{ type: "error", code: "SERVER_ERROR" }]);
			expect(cancel).toHaveBeenCalledTimes(1);
		});

		it("바이트가 올 때마다 30초를 새로 셈", async () => {
			vi.useFakeTimers();
			const encoder = new TextEncoder();
			let streamController!: ReadableStreamDefaultController<Uint8Array>;
			const body = new ReadableStream<Uint8Array>({
				start(controller) {
					streamController = controller;
				},
			});
			const result = collect(body);

			await vi.advanceTimersByTimeAsync(20_000);
			streamController.enqueue(encoder.encode(": heartbeat\n\n"));
			await vi.advanceTimersByTimeAsync(20_000);
			streamController.enqueue(
				encoder.encode('data: {"type":"delta","text":"가"}\n\n'),
			);
			streamController.close();

			expect(await result).toEqual([{ type: "delta", text: "가" }]);
		});
	});
});
