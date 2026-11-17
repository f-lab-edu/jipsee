import { createContext } from "react";

type NewChatContextValue = {
	newChatCount: number;
	startNewChat: () => void;
};

// 제공자 밖에서는 새 대화 신호가 없어 링크 이동만 일어남
export const newChatContext = createContext<NewChatContextValue>({
	newChatCount: 0,
	startNewChat: () => undefined,
});
