import {
	chatMockScenario,
	chatMockStreamDelayMs,
} from "@/entities/chat/api/chatMock";
import { nextChatMockChatId } from "@/entities/chat/api/nextChatMockChatId";
import { pickChatMockAnswer } from "@/entities/chat/api/pickChatMockAnswer";
import { saveChatMockExchange } from "@/entities/chat/api/saveChatMockExchange";
import { toChatTitle } from "@/entities/chat/lib/toChatTitle";
import { waitMilliseconds } from "@/entities/chat/lib/waitMilliseconds";
import type { ChatSendRequest } from "@/entities/chat/model/chatSendRequest";
import type { ChatStreamEvent } from "@/entities/chat/model/chatStreamEvent";

/**
 * 채팅 > 목업 스트림 생성
 *
 * - 새 대화이면 번호를 정해 chat 이벤트를 먼저 보냄
 * - 답변을 줄 단위로 delta 이벤트에 나눠 지연 간격으로 보냄
 * - serverError 시나리오이면 첫 줄 뒤에 SERVER_ERROR 이벤트를 보내고 저장하지 않음
 * - 마지막에 대화를 저장하고 done 이벤트를 보냄. 저장할 대화가 없으면 SERVER_ERROR 이벤트를 보냄
 * - 연결이 끊기면 멈춤
 * - 이벤트는 data: JSON 줄과 빈 줄로 이루어진 서버 전송 이벤트 형식임
 */
export function createChatMockStream(
	identifier: string,
	request: ChatSendRequest,
): ReadableStream<Uint8Array> {
	const encoder = new TextEncoder();
	const answer = pickChatMockAnswer(request.content);
	const chatId = request.chatId ?? nextChatMockChatId(identifier);
	let isCancelled = false;

	return new ReadableStream<Uint8Array>({
		async start(controller) {
			const send = (event: ChatStreamEvent) => {
				controller.enqueue(
					encoder.encode(`data: ${JSON.stringify(event)}\n\n`),
				);
			};
			const pause = async () => {
				await waitMilliseconds(chatMockStreamDelayMs);
				return isCancelled;
			};

			if (request.chatId === null) {
				send({
					type: "chat",
					chatId,
					title: toChatTitle(request.content),
				});
			}

			for (const [index, line] of answer.lines.entries()) {
				if (await pause()) {
					return;
				}

				send({ type: "delta", text: index === 0 ? line : `\n${line}` });

				if (chatMockScenario === "serverError") {
					if (await pause()) {
						return;
					}

					send({ type: "error", code: "SERVER_ERROR" });
					controller.close();
					return;
				}
			}

			const saved = saveChatMockExchange(
				identifier,
				request,
				chatId,
				answer,
				new Date(),
			);

			if (saved) {
				send({ type: "done", message: saved.assistantMessage });
			} else {
				send({ type: "error", code: "SERVER_ERROR" });
			}

			controller.close();
		},
		cancel() {
			isCancelled = true;
		},
	});
}
