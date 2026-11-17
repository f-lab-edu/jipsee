import { Text, VStack } from "@seed-design/react";
import { chatCopy } from "@/pages/chat/config/chatCopy";
import { chatRailStyles } from "@/pages/chat/config/chatRailStyles";

/** 채팅 > 대화 목록 레일 > 빈 목록 안내 */
export default function ChatRailEmpty() {
	const style = chatRailStyles;

	return (
		<VStack as="section" data-area="chat-history-empty" {...style.empty}>
			<Text as="p" {...style.emptyText}>
				{chatCopy.historyEmpty}
			</Text>
		</VStack>
	);
}
