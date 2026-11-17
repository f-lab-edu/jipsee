import type { RetryableStatusKind } from "@/shared/model/statusKind";
import PartialStatusBody from "@/shared/ui/PartialStatusBody";
import ResponsiveLayout from "@/shared/ui/ResponsiveLayout";

interface PartialStatusPanelProps {
	kind: RetryableStatusKind;
}

/**
 * 공통 > 영역 상태 패널
 *
 * - 화면 전체를 바꾸지 않고 실패한 본문 영역만 대신해 출력
 * - 모바일과 데스크톱 레이아웃을 모두 그리고 화면 폭에 맞는 쪽만 노출
 */
export default function PartialStatusPanel({ kind }: PartialStatusPanelProps) {
	return (
		<ResponsiveLayout
			testId="partial-status"
			fillsHeight
			mobile={<PartialStatusBody layout="mobile" kind={kind} />}
			desktop={<PartialStatusBody layout="desktop" kind={kind} />}
		/>
	);
}
