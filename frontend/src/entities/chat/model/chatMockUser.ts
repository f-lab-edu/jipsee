import type { Chat } from "@/entities/chat/model/chat";

// 목업이 브라우저마다 따로 기억하는 상태. touchedChats는 질문을 더한 대화이고 최근 순임
export type ChatMockUser = {
	deletedIds: number[];
	touchedChats: Chat[];
};
