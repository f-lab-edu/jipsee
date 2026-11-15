import { useContext } from "react";
import { newChatContext } from "@/pages/chat/model/newChatContext";

/** 채팅 > 새 대화 신호 읽기 */
export function useNewChat() {
	return useContext(newChatContext);
}
