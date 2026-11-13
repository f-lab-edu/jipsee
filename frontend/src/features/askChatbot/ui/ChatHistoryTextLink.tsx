import { Box, Text } from "@seed-design/react";
import Link from "next/link";
import { chatPanelCopy } from "@/features/askChatbot/config/chatPanelCopy";
import type { ChatHistoryLinkStyle } from "@/features/askChatbot/model/chatHistoryLinkStyle";
import { paths } from "@/shared/routes/paths";

interface ChatHistoryTextLinkProps {
	style: ChatHistoryLinkStyle;
}

/** 챗봇 > 지난 대화 텍스트 링크 */
export default function ChatHistoryTextLink({
	style,
}: ChatHistoryTextLinkProps) {
	return (
		<Box asChild {...style.box}>
			<Link href={paths.chatHistory}>
				<Text {...style.text}>{chatPanelCopy.history}</Text>
			</Link>
		</Box>
	);
}
