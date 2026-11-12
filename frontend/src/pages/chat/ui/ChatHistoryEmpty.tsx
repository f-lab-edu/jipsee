import { Text, VStack } from "@seed-design/react";
import { chatCopy } from "@/pages/chat/config/chatCopy";
import { chatHistoryStyles } from "@/pages/chat/config/chatHistoryStyles";

/** 채팅 > 빈 대화 목록 안내 */
export default function ChatHistoryEmpty() {
	const style = chatHistoryStyles;

	return (
		<VStack as="section" data-area="chat-history-empty" {...style.empty}>
			<Text as="p" {...style.emptyText}>
				{chatCopy.historyEmpty}
			</Text>
		</VStack>
	);
}
