"use client";

import { useSession } from "@/entities/session/model/useSession";
import StatusScreen from "@/pages/status/ui/StatusScreen";

interface RootErrorProps {
	reset: () => void;
}

/**
 * 오류 > 경계
 *
 * - 예상하지 못한 실패에서 헤더, 푸터, 하단 내비게이션을 둔 일반 오류 화면 출력
 * - 다시 시도는 서버 데이터를 다시 요청하고 오류 경계를 초기화
 * - 요청 제한(429)은 데이터 계층이 상태 값으로 돌려주므로 여기서 구분하지 않음
 */
export default function RootError({ reset }: RootErrorProps) {
	const session = useSession();

	return <StatusScreen kind="error" session={session} reset={reset} />;
}
