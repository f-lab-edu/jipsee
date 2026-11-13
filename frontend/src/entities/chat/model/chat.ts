import type { ChatMessage } from "@/entities/chat/model/chatMessage";
import type { ChatSummary } from "@/entities/chat/model/chatSummary";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

export type Chat = ChatSummary & {
	buildingId: Nullable<number>;
	buildingName: Nullable<string>;
	messages: ChatMessage[];
};
