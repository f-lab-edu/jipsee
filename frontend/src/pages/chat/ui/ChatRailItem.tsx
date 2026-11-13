import { HStack, Text, VStack } from "@seed-design/react";
import Link from "next/link";
import { toChatTimeLabel } from "@/entities/chat/lib/toChatTimeLabel";
import type { ChatSummary } from "@/entities/chat/model/chatSummary";
import DeleteChatButton from "@/features/deleteChat/ui/DeleteChatButton";
import { chatRailStyles } from "@/pages/chat/config/chatRailStyles";
import { paths } from "@/shared/routes/paths";

interface ChatRailItemProps {
	chat: ChatSummary;
	now: Date;
	isCurrent: boolean;
}

/**
 * 채팅 > 대화 목록 레일 > 항목
 *
 * - 제목은 한 줄로 말줄임하고 아래에 마지막 메시지 시각 출력
 * - 누르면 대화로 이동하고 오른쪽에 삭제 버튼 출력
 * - 지금 보는 대화이면 흰 바탕과 굵은 제목으로 표시하고 링크의 aria-current를 page로 지정
 *
 * @param now 시각 표시의 오늘과 어제를 정하는 기준
 */
export default function ChatRailItem({
	chat,
	now,
	isCurrent,
}: ChatRailItemProps) {
	const style = chatRailStyles;

	if (isCurrent) {
		return (
			<HStack as="li" data-area="chat-history-item" {...style.itemCurrent}>
				<VStack asChild {...style.link}>
					<Link href={paths.chatDetail(chat.id)} aria-current="page">
						<Text {...style.linkTitleCurrent}>{chat.title}</Text>
						<Text {...style.linkTime}>
							{toChatTimeLabel(chat.lastMessageAt, now)}
						</Text>
					</Link>
				</VStack>
				<DeleteChatButton chatId={chat.id} title={chat.title} variant="rail" />
			</HStack>
		);
	}

	return (
		<HStack as="li" data-area="chat-history-item" {...style.item}>
			<VStack asChild {...style.link}>
				<Link href={paths.chatDetail(chat.id)}>
					<Text {...style.linkTitle}>{chat.title}</Text>
					<Text {...style.linkTime}>
						{toChatTimeLabel(chat.lastMessageAt, now)}
					</Text>
				</Link>
			</VStack>
			<DeleteChatButton chatId={chat.id} title={chat.title} variant="rail" />
		</HStack>
	);
}
