import ChatToolbarRow from "@/pages/chat/ui/ChatToolbarRow";
import ResponsiveLayout from "@/shared/ui/ResponsiveLayout";

/**
 * 채팅 > 도구줄
 *
 * - 모바일과 데스크톱 한 줄을 함께 렌더링
 */
export default function ChatToolbar() {
	return (
		<ResponsiveLayout
			testId="chat-toolbar"
			mobile={<ChatToolbarRow layout="mobile" />}
			desktop={<ChatToolbarRow layout="desktop" />}
		/>
	);
}
