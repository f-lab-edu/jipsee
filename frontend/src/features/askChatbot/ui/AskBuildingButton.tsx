import { Box, Icon, Text } from "@seed-design/react";
import Link from "next/link";
import type { Session } from "@/entities/session/model/session";
import { askBuildingCopy } from "@/features/askChatbot/config/askBuildingCopy";
import { askBuildingStyles } from "@/features/askChatbot/config/askBuildingStyles";
import { toAskBuildingHref } from "@/features/askChatbot/lib/toAskBuildingHref";
import ChatBubbleIcon from "@/features/askChatbot/ui/ChatBubbleIcon";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";

interface AskBuildingButtonProps {
	buildingId: number;
	session: Nullable<Session>;
	layout: ResponsiveVariant;
}

/**
 * 건물 질문하기 > 질문하기 버튼
 *
 * - 말풍선 아이콘과 문구를 담은 파란 링크 출력
 * - 로그인하지 않았으면 로그인 경로, 로그인했으면 건물 번호를 담은 채팅 경로로 이동
 *
 * @param layout 모바일은 높이 52, 데스크톱은 높이 56에 둥글기를 키움
 */
export default function AskBuildingButton({
	buildingId,
	session,
	layout,
}: AskBuildingButtonProps) {
	const style = askBuildingStyles;

	return (
		<Box asChild {...style.button[layout]}>
			<Link href={toAskBuildingHref(buildingId, session)}>
				<Icon svg={<ChatBubbleIcon />} {...style.buttonIcon} />
				<Text {...style.buttonText}>{askBuildingCopy.button}</Text>
			</Link>
		</Box>
	);
}
