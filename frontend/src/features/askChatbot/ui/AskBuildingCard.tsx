import { Box } from "@seed-design/react";
import type { Session } from "@/entities/session/model/session";
import { askBuildingCopy } from "@/features/askChatbot/config/askBuildingCopy";
import { askBuildingStyles } from "@/features/askChatbot/config/askBuildingStyles";
import AskBuildingButton from "@/features/askChatbot/ui/AskBuildingButton";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

interface AskBuildingCardProps {
	buildingId: number;
	session: Nullable<Session>;
}

/**
 * 건물 질문하기 > 데스크톱 카드
 *
 * - aside 안에 놓는 카드 section
 * - 질문하기 버튼 출력
 */
export default function AskBuildingCard({
	buildingId,
	session,
}: AskBuildingCardProps) {
	const style = askBuildingStyles;

	return (
		<Box
			as="section"
			aria-label={askBuildingCopy.sectionLabel}
			data-area="ask-building-card"
			{...style.card}
		>
			<AskBuildingButton
				buildingId={buildingId}
				session={session}
				layout="desktop"
			/>
		</Box>
	);
}
