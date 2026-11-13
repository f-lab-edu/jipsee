import { HStack, Text, VStack } from "@seed-design/react";
import Link from "next/link";
import { toChatTimeLabel } from "@/entities/chat/lib/toChatTimeLabel";
import type { ChatSummary } from "@/entities/chat/model/chatSummary";
import DeleteChatButton from "@/features/deleteChat/ui/DeleteChatButton";
import { chatHistoryStyles } from "@/pages/chat/config/chatHistoryStyles";
import { paths } from "@/shared/routes/paths";

interface ChatHistoryItemProps {
	chat: ChatSummary;
	now: Date;
}

/**
 * 채팅 > 대화 목록 항목
 *
 * - 제목은 한 줄로 말줄임하고 아래에 마지막 메시지 시각 출력
 * - 누르면 대화로 이동
 * - 오른쪽에 삭제 버튼 출력
 *
 * @param now 시각 표시의 오늘과 어제를 정하는 기준
 */
export default function ChatHistoryItem({ chat, now }: ChatHistoryItemProps) {
	const style = chatHistoryStyles;

	return (
		<HStack as="li" data-area="chat-history-item" {...style.item}>
			<VStack asChild {...style.link}>
				<Link href={paths.chatDetail(chat.id)}>
					<Text {...style.title}>{chat.title}</Text>
					<Text {...style.time}>
						{toChatTimeLabel(chat.lastMessageAt, now)}
					</Text>
				</Link>
			</VStack>
			<DeleteChatButton chatId={chat.id} title={chat.title} variant="list" />
		</HStack>
	);
}
