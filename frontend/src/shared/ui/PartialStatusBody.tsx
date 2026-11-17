import { VStack } from "@seed-design/react";
import { partialStatusStyles } from "@/shared/config/partialStatusStyles";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";
import type { RetryableStatusKind } from "@/shared/model/statusKind";
import PartialStatus from "@/shared/ui/PartialStatus";

interface PartialStatusBodyProps {
	layout: ResponsiveVariant;
	kind: RetryableStatusKind;
}

/**
 * 공통 > 영역 상태 배치
 *
 * - 남는 높이를 채우는 패널 안 가운데에 영역 상태 출력
 * - 패널은 데스크톱에서만 테두리와 흰 배경이 있음
 */
export default function PartialStatusBody({
	layout,
	kind,
}: PartialStatusBodyProps) {
	const style = partialStatusStyles[layout];

	return (
		<VStack {...style.panel}>
			<PartialStatus layout={layout} kind={kind} />
		</VStack>
	);
}
