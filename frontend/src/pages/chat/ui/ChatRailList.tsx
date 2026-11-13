import { VStack } from "@seed-design/react";
import type { ChatSummary } from "@/entities/chat/model/chatSummary";
import { chatCopy } from "@/pages/chat/config/chatCopy";
import { chatRailStyles } from "@/pages/chat/config/chatRailStyles";
import ChatRailItem from "@/pages/chat/ui/ChatRailItem";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

interface ChatRailListProps {
	chats: ChatSummary[];
	now: Date;
	chatId: Nullable<number>;
}

/**
 * 채팅 > 대화 목록 레일 > 목록
 *
 * - nav 안에 대화를 받은 순서대로 출력
 * - 목록이 길면 레일 안에서 세로로 스크롤
 */
export default function ChatRailList({
	chats,
	now,
	chatId,
}: ChatRailListProps) {
	const style = chatRailStyles;

	return (
		<VStack
			as="nav"
			aria-label={chatCopy.historyListLabel}
			data-area="chat-history"
			{...style.nav}
		>
			<VStack as="ul" {...style.list}>
				{chats.map((chat) => (
					<ChatRailItem
						key={chat.id}
						chat={chat}
						now={now}
						isCurrent={chat.id === chatId}
					/>
				))}
			</VStack>
		</VStack>
	);
}
