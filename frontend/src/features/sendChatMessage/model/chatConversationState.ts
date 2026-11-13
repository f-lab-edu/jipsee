import type { ChatMessage } from "@/entities/chat/model/chatMessage";
import type { ChatPhase } from "@/features/sendChatMessage/model/chatPhase";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

export type ChatConversationState = {
	chatId: Nullable<number>;
	messages: ChatMessage[];
	draft: string;
	phase: ChatPhase;
	errorCode: Nullable<"TOO_MANY_REQUESTS" | "SERVER_ERROR">;
};
