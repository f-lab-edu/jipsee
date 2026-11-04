import { Box, Icon } from "@seed-design/react";
import Link from "next/link";
import { chatPanelCopy } from "@/features/askChatbot/config/chatPanelCopy";
import type { ChatHistoryIconLinkStyle } from "@/features/askChatbot/model/chatHistoryIconLinkStyle";
import ChatHistoryIcon from "@/features/askChatbot/ui/ChatHistoryIcon";
import { paths } from "@/shared/routes/paths";

interface ChatHistoryIconLinkProps {
	style: ChatHistoryIconLinkStyle;
}

/** 챗봇 > 지난 대화 아이콘 링크 */
export default function ChatHistoryIconLink({
	style,
}: ChatHistoryIconLinkProps) {
	return (
		<Box asChild {...style.box}>
			<Link
				href={paths.chat}
				aria-label={chatPanelCopy.history}
				title={chatPanelCopy.history}
			>
				<Icon svg={<ChatHistoryIcon />} {...style.icon} />
			</Link>
		</Box>
	);
}
