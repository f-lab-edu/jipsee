import { Box, Icon, Text } from "@seed-design/react";
import type { Session } from "@/entities/session/model/session";
import { askBuildingCopy } from "@/features/askChatbot/config/askBuildingCopy";
import { askBuildingStyles } from "@/features/askChatbot/config/askBuildingStyles";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import LockIcon from "@/shared/ui/LockIcon";

interface AskBuildingGuideProps {
	session: Nullable<Session>;
}

/**
 * 건물 질문하기 > 로그인 안내 한 줄
 *
 * - 로그인했으면 출력하지 않음
 * - 로그인하지 않았으면 잠금 아이콘과 로그인 화면으로 이동한다는 문구 출력
 */
export default function AskBuildingGuide({ session }: AskBuildingGuideProps) {
	const style = askBuildingStyles;

	if (session) {
		return null;
	}

	return (
		<Box {...style.guide}>
			<Icon svg={<LockIcon />} {...style.guideIcon} />
			<Text {...style.guideText}>{askBuildingCopy.loginGuide}</Text>
		</Box>
	);
}
