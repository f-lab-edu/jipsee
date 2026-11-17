import { HStack, Text } from "@seed-design/react";
import { chatCopy } from "@/pages/chat/config/chatCopy";
import { chatScreenStyles } from "@/pages/chat/config/chatScreenStyles";

/**
 * 채팅 > 대화 목록 도구줄 한 줄
 *
 * - 제목 h1만 출력
 */
export default function ChatHistoryToolbarRow() {
	const style = chatScreenStyles.toolbar;

	return (
		<HStack {...style.root}>
			<HStack {...style.titleGroup}>
				<Text as="h1" {...style.title}>
					{chatCopy.historyTitle}
				</Text>
			</HStack>
		</HStack>
	);
}
