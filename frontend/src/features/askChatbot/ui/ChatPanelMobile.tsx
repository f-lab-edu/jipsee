import type { Session } from "@/entities/session/model/session";
import ChatCompactBar from "@/features/askChatbot/ui/ChatCompactBar";
import ChatExpandedPanel from "@/features/askChatbot/ui/ChatExpandedPanel";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

interface ChatPanelMobileProps {
	session: Nullable<Session>;
	layout: "expanded" | "compact";
}

/**
 * 챗봇 > 모바일 패널
 *
 * - expanded이면 펼침 패널 출력
 * - compact이면 축소 바 출력
 *
 * @param layout 화면이 정하는 패널 모양
 */
export default function ChatPanelMobile({
	session,
	layout,
}: ChatPanelMobileProps) {
	if (layout === "expanded") {
		return <ChatExpandedPanel session={session} />;
	}

	return <ChatCompactBar session={session} />;
}
