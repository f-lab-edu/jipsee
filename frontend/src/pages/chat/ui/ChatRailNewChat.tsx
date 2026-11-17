import IconPlusLine from "@karrotmarket/react-monochrome-icon/IconPlusLine";
import { Box, Icon, Text } from "@seed-design/react";
import { chatCopy } from "@/pages/chat/config/chatCopy";
import { chatRailStyles } from "@/pages/chat/config/chatRailStyles";
import ChatNewChatLink from "@/pages/chat/ui/ChatNewChatLink";

interface ChatRailNewChatProps {
	isCurrent: boolean;
}

/**
 * 채팅 > 대화 목록 레일 > 새 대화 링크
 *
 * - 플러스 아이콘과 새 대화 출력
 * - 새 대화를 보고 있으면 파란 테두리로 표시하고 aria-current를 page로 지정
 */
export default function ChatRailNewChat({ isCurrent }: ChatRailNewChatProps) {
	const style = chatRailStyles;

	if (isCurrent) {
		return (
			<Box asChild {...style.newChatCurrent}>
				<ChatNewChatLink aria-current="page">
					<Icon svg={<IconPlusLine />} {...style.newChatIcon} />
					<Text {...style.newChatCurrentText}>{chatCopy.newChat}</Text>
				</ChatNewChatLink>
			</Box>
		);
	}

	return (
		<Box asChild {...style.newChat}>
			<ChatNewChatLink>
				<Icon svg={<IconPlusLine />} {...style.newChatIcon} />
				<Text {...style.newChatText}>{chatCopy.newChat}</Text>
			</ChatNewChatLink>
		</Box>
	);
}
