import type { ChatMockUser } from "@/entities/chat/model/chatMockUser";

const globalForStore = globalThis as typeof globalThis & {
	chatMockStore?: Map<string, ChatMockUser>;
};

// 개발 서버가 다시 컴파일되어도 유지되도록 전역에 둠. 키는 브라우저마다 다른 목업 식별자임
export const chatMockStore: Map<string, ChatMockUser> =
	globalForStore.chatMockStore ?? new Map();

globalForStore.chatMockStore = chatMockStore;

export const chatMockCookieName = "jipsee-mock-user";
