import { VStack } from "@seed-design/react";
import { statusStyles } from "@/shared/config/statusStyles";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";
import type { StatusKind } from "@/shared/model/statusKind";
import StatusContent from "@/shared/ui/StatusContent";

interface StatusPanelBodyProps {
	layout: ResponsiveVariant;
	kind: StatusKind;
	reset?: () => void;
}

/**
 * 공통 > 상태 화면 본문 배치
 *
 * - 본문 안에 카드를 두고 그 안에 내용 출력
 * - 카드는 데스크톱에서만 테두리와 배경이 있음
 */
export default function StatusPanelBody({
	layout,
	kind,
	reset,
}: StatusPanelBodyProps) {
	const style = statusStyles[layout];

	return (
		<VStack {...style.body}>
			<VStack {...style.card}>
				<StatusContent layout={layout} kind={kind} reset={reset} />
			</VStack>
		</VStack>
	);
}
