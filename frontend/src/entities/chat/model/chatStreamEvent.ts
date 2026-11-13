import type { ChatMessage } from "@/entities/chat/model/chatMessage";
import type { ChatStreamErrorCode } from "@/entities/chat/model/chatStreamError";

export type ChatStreamEvent =
	| { type: "chat"; chatId: number; title: string }
	| { type: "delta"; text: string }
	| { type: "done"; message: ChatMessage }
	| { type: "error"; code: ChatStreamErrorCode };
