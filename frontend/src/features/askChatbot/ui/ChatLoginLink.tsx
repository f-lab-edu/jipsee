import { Box, Text } from "@seed-design/react";
import Link from "next/link";
import { chatPanelCopy } from "@/features/askChatbot/config/chatPanelCopy";
import type { ChatLoginLinkStyle } from "@/features/askChatbot/model/chatLoginLinkStyle";
import { paths } from "@/shared/routes/paths";

interface ChatLoginLinkProps {
	style: ChatLoginLinkStyle;
}

/** 챗봇 > 로그인 유도 버튼 */
export default function ChatLoginLink({ style }: ChatLoginLinkProps) {
	return (
		<Box asChild {...style.box}>
			<Link href={paths.loginWithNext(paths.chat)}>
				<Text {...style.text}>{chatPanelCopy.login}</Text>
			</Link>
		</Box>
	);
}
