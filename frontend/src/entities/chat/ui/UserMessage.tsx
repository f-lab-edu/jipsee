import { Box, Text, VisuallyHidden, VStack } from "@seed-design/react";
import { chatMessageCopy } from "@/entities/chat/config/chatMessageCopy";
import { chatMessageStyles } from "@/entities/chat/config/chatMessageStyles";

interface UserMessageProps {
	content: string;
}

/**
 * 채팅 > 사용자 말풍선
 *
 * - 오른쪽에 파란 채움 말풍선 출력
 * - 보이지 않는 제목으로 내 질문 출력
 */
export default function UserMessage({ content }: UserMessageProps) {
	const style = chatMessageStyles;

	return (
		<VStack as="article" data-area="chat-message-user" {...style.userArticle}>
			<VisuallyHidden asChild>
				<h2>{chatMessageCopy.userHeading}</h2>
			</VisuallyHidden>
			<Box {...style.userBubble}>
				<Text as="p" {...style.userText}>
					{content}
				</Text>
			</Box>
		</VStack>
	);
}
