import type { ChatBuildingLink } from "@/entities/chat/model/chatBuildingLink";
import type { ChatSource } from "@/entities/chat/model/chatSource";

export type ChatMockAnswer = {
	lines: string[];
	sources: ChatSource[];
	buildings: ChatBuildingLink[];
};
