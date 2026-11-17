import type { ChatStreamErrorCode } from "@/entities/chat/model/chatStreamError";

export type ChatErrorCode = Extract<
	ChatStreamErrorCode,
	"TOO_MANY_REQUESTS" | "SERVER_ERROR"
>;
