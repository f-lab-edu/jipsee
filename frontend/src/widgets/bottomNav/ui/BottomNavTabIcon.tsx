import ChatBubbleIcon from "@/features/askChatbot/ui/ChatBubbleIcon";
import type { BottomNavTabId } from "@/widgets/bottomNav/model/bottomNavTab";
import HomeTabIcon from "@/widgets/bottomNav/ui/HomeTabIcon";
import MeTabIcon from "@/widgets/bottomNav/ui/MeTabIcon";

interface BottomNavTabIconProps {
	id: BottomNavTabId;
	strokeWidth: number;
}

/**
 * 하단 내비게이션 > 탭 아이콘
 *
 * - 탭 id에 맞는 윤곽선 아이콘 출력
 *
 * @param strokeWidth 선 굵기. 활성 탭이 더 굵음
 */
export default function BottomNavTabIcon({
	id,
	strokeWidth,
}: BottomNavTabIconProps) {
	if (id === "home") {
		return <HomeTabIcon strokeWidth={strokeWidth} />;
	}

	if (id === "chat") {
		return <ChatBubbleIcon strokeWidth={strokeWidth} />;
	}

	return <MeTabIcon strokeWidth={strokeWidth} />;
}
