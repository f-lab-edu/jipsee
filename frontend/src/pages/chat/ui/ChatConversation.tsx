"use client";

import type { ChatMessage } from "@/entities/chat/model/chatMessage";
import { useNewChat } from "@/pages/chat/model/useNewChat";
import ChatConversationBody from "@/pages/chat/ui/ChatConversationBody";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

interface ChatConversationProps {
	chatId: Nullable<number>;
	buildingId: Nullable<string>;
	initialMessages: ChatMessage[];
	isLimitReached: boolean;
}

/**
 * 채팅 > 대화
 *
 * - 새 대화 링크를 누를 때마다 대화 본문을 새로 시작해 진행 중인 스트림과 입력 버리기
 */
export default function ChatConversation(props: ChatConversationProps) {
	const { newChatCount } = useNewChat();

	return <ChatConversationBody key={newChatCount} {...props} />;
}
