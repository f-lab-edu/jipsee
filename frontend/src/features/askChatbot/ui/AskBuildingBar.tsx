import { Box } from "@seed-design/react";
import type { Session } from "@/entities/session/model/session";
import { askBuildingCopy } from "@/features/askChatbot/config/askBuildingCopy";
import { askBuildingStyles } from "@/features/askChatbot/config/askBuildingStyles";
import AskBuildingButton from "@/features/askChatbot/ui/AskBuildingButton";
import AskBuildingGuide from "@/features/askChatbot/ui/AskBuildingGuide";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

interface AskBuildingBarProps {
	buildingId: number;
	session: Nullable<Session>;
}

/**
 * 건물 질문하기 > 모바일 하단 바
 *
 * - lg 미만에서만 보이고 화면 아래에 붙는 section
 * - 질문하기 버튼과 로그인 안내 한 줄 출력
 */
export default function AskBuildingBar({
	buildingId,
	session,
}: AskBuildingBarProps) {
	const style = askBuildingStyles;

	return (
		<Box as="section" aria-label={askBuildingCopy.sectionLabel} {...style.bar}>
			<AskBuildingButton
				buildingId={buildingId}
				session={session}
				layout="mobile"
			/>
			<AskBuildingGuide session={session} />
		</Box>
	);
}
