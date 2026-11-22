import type { StatusKind } from "@/shared/model/statusKind";
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
 * - 모바일과 데스크톱이 같은 요소를 쓰고 값만 반응형으로 바꿈
 *
 * @param reset 오류 경계(error.tsx)가 넘겨 주는 복구 함수
 */
export default function StatusPanel({ kind, reset }: StatusPanelProps) {
	return <StatusPanelBody kind={kind} reset={reset} />;
}
