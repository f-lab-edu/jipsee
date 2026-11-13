import { Box } from "@seed-design/react";
import ChatToolbarRow from "@/pages/chat/ui/ChatToolbarRow";

/**
 * 채팅 > 도구줄
 *
 * - 1280 미만에서만 출력. 1280 이상은 대화 목록 레일이 제목과 새 대화를 가짐
 */
export default function ChatToolbar() {
	return (
		<Box
			hideFrom="lg"
			data-testid="chat-toolbar-mobile"
			data-area="chat-toolbar-mobile"
		>
			<ChatToolbarRow />
		</Box>
	);
}
