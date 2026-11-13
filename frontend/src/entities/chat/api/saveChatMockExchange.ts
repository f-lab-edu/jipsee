import { chatMockBuildings } from "@/entities/chat/api/chatMock";
import { chatMockStore } from "@/entities/chat/api/chatMockStore";
import { createChatMockChats } from "@/entities/chat/api/createChatMockChats";
import { toChatTitle } from "@/entities/chat/lib/toChatTitle";
import { toKstIso } from "@/entities/chat/lib/toKstIso";
import type { Chat } from "@/entities/chat/model/chat";
import type { ChatMessage } from "@/entities/chat/model/chatMessage";
import type { ChatMockAnswer } from "@/entities/chat/model/chatMockAnswer";
import type { ChatSendRequest } from "@/entities/chat/model/chatSendRequest";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

/**
 * 채팅 > 목업 질문과 답변 저장
 *
 * - 새 대화이면 첫 질문의 앞 40자를 제목으로 해 주어진 번호의 대화를 만듦
 * - 있는 대화이면 질문과 답변을 뒤에 더함
 * - 질문을 더한 대화는 목록 맨 앞으로 옮김
 * - 없는 대화이면 null 반환
 *
 * @returns 저장한 대화와 답변 메시지
 */
export function saveChatMockExchange(
	identifier: string,
	request: ChatSendRequest,
	chatId: number,
	answer: ChatMockAnswer,
	now: Date,
): Nullable<{ chat: Chat; assistantMessage: ChatMessage }> {
	const user = chatMockStore.get(identifier);

	if (!user) {
		return null;
	}

	const createdAt = toKstIso(now);
	let chat: Chat | undefined;

	if (request.chatId === null) {
		const building = chatMockBuildings.find(
			(item) => item.id === request.buildingId,
		);

		chat = {
			id: chatId,
			title: toChatTitle(request.content),
			lastMessageAt: createdAt,
			buildingId: building?.id ?? null,
			buildingName: building?.name ?? null,
			messages: [],
		};
	} else {
		chat =
			user.touchedChats.find((item) => item.id === chatId) ??
			createChatMockChats(now).find((item) => item.id === chatId);
	}

	if (!chat) {
		return null;
	}

	const lastMessageId = chat.messages.at(-1)?.id ?? 0;
	const assistantMessage: ChatMessage = {
		id: lastMessageId + 2,
		role: "ASSISTANT",
		content: answer.lines.join("\n"),
		sources: answer.sources,
		buildings: answer.buildings,
		createdAt,
	};
	const saved: Chat = {
		...chat,
		lastMessageAt: createdAt,
		messages: [
			...chat.messages,
			{
				id: lastMessageId + 1,
				role: "USER",
				content: request.content,
				sources: [],
				buildings: [],
				createdAt,
			},
			assistantMessage,
		],
	};

	user.touchedChats = [
		saved,
		...user.touchedChats.filter((item) => item.id !== saved.id),
	];

	return { chat: saved, assistantMessage };
}
