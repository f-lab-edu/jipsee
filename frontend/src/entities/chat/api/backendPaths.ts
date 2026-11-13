import type { ChatBackendPath } from "@/entities/chat/model/chatBackendPath";

// 1단계 API 명세가 없어 가정한 값. 명세가 정해지면 이 파일만 바꿈
export const backendPaths: Record<
	"list" | "detail" | "send" | "remove" | "limit",
	ChatBackendPath
> = {
	list: { method: "GET", path: "/api/chats" },
	detail: { method: "GET", path: "/api/chats/{id}" },
	send: { method: "POST", path: "/api/chats/messages" },
	remove: { method: "DELETE", path: "/api/chats/{id}" },
	limit: { method: "GET", path: "/api/chats/limit" },
};
