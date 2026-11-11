import type { SVGProps } from "react";
import ChatBubbleIcon from "@/features/askChatbot/ui/ChatBubbleIcon";
import type { BottomNavTabId } from "@/widgets/bottomNav/model/bottomNavTab";
import HomeTabIcon from "@/widgets/bottomNav/ui/HomeTabIcon";
import MeTabIcon from "@/widgets/bottomNav/ui/MeTabIcon";

interface BottomNavTabIconProps extends SVGProps<SVGSVGElement> {
	id: BottomNavTabId;
	strokeWidth: number;
}

/**
 * 하단 내비게이션 > 탭 아이콘
 *
 * - 탭 id에 맞는 윤곽선 아이콘 출력
 *
 * - Seed Icon이 넘기는 크기와 색 속성을 아이콘에 전달
 *
 * @param strokeWidth 선 굵기. 활성 탭이 더 굵음
 */
export default function BottomNavTabIcon({
	id,
	strokeWidth,
	...props
}: BottomNavTabIconProps) {
	if (id === "home") {
		return <HomeTabIcon strokeWidth={strokeWidth} {...props} />;
	}

	if (id === "chat") {
		return <ChatBubbleIcon strokeWidth={strokeWidth} {...props} />;
	}

	return <MeTabIcon strokeWidth={strokeWidth} {...props} />;
}
