import type { ChatBuildingLink } from "@/entities/chat/model/chatBuildingLink";
import type { ChatSource } from "@/entities/chat/model/chatSource";

// sources와 buildings는 사용자 메시지에서 빈 배열. createdAt은 ISO 8601 한국 시간
export type ChatMessage = {
	id: number;
	role: "USER" | "ASSISTANT";
	content: string;
	sources: ChatSource[];
	buildings: ChatBuildingLink[];
	createdAt: string;
};
