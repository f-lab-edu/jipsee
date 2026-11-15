import type { StatusKind } from "@/shared/model/statusKind";
import ResponsiveLayout from "@/shared/ui/ResponsiveLayout";
import StatusPanelBody from "@/shared/ui/StatusPanelBody";

interface StatusPanelProps {
	kind: StatusKind;
	reset?: () => void;
}

/**
 * 공통 > 상태 화면 본문
 *
 * - 모바일은 흰 열 안 가운데에 내용 출력
 * - 데스크톱은 하늘빛 배경 위 가운데에 폭 480 카드로 내용 출력
 * - 모바일과 데스크톱 레이아웃을 모두 그리고 화면 폭에 맞는 쪽만 노출
 *
 * @param reset 오류 경계(error.tsx)가 넘겨 주는 복구 함수
 */
export default function StatusPanel({ kind, reset }: StatusPanelProps) {
	return (
		<ResponsiveLayout
			testId="status"
			fillsHeight
			mobile={<StatusPanelBody layout="mobile" kind={kind} reset={reset} />}
			desktop={<StatusPanelBody layout="desktop" kind={kind} reset={reset} />}
		/>
	);
}
