import type { ChatMessage } from "@/entities/chat/model/chatMessage";
import AssistantMessage from "@/entities/chat/ui/AssistantMessage";
import UserMessage from "@/entities/chat/ui/UserMessage";

interface ChatMessageItemProps {
	message: ChatMessage;
}

/**
 * 채팅 > 메시지 한 개
 *
 * - 사용자 메시지이면 사용자 말풍선, 답변이면 답변 말풍선 출력
 */
export default function ChatMessageItem({ message }: ChatMessageItemProps) {
	if (message.role === "USER") {
		return <UserMessage content={message.content} />;
	}

	return <AssistantMessage message={message} />;
}
