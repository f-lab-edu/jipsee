import { VStack } from "@seed-design/react";
import type { ChatSummary } from "@/entities/chat/model/chatSummary";
import { chatCopy } from "@/pages/chat/config/chatCopy";
import { chatHistoryStyles } from "@/pages/chat/config/chatHistoryStyles";
import ChatHistoryItem from "@/pages/chat/ui/ChatHistoryItem";

interface ChatHistoryListProps {
	chats: ChatSummary[];
	now: Date;
}

/**
 * 채팅 > 대화 목록
 *
 * - nav 안에 대화를 받은 순서대로 출력
 */
export default function ChatHistoryList({ chats, now }: ChatHistoryListProps) {
	const style = chatHistoryStyles;

	return (
		<VStack
			as="nav"
			aria-label={chatCopy.historyListLabel}
			data-area="chat-history"
			{...style.root}
		>
			<VStack as="ul" {...style.list}>
				{chats.map((chat) => (
					<ChatHistoryItem key={chat.id} chat={chat} now={now} />
				))}
			</VStack>
		</VStack>
	);
}
