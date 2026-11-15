import { VStack } from "@seed-design/react";
import type { Session } from "@/entities/session/model/session";
import { statusScreenStyles } from "@/pages/status/config/statusScreenStyles";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import type { StatusKind } from "@/shared/model/statusKind";
import { paths } from "@/shared/routes/paths";
import StatusPanel from "@/shared/ui/StatusPanel";
import BottomNav from "@/widgets/bottomNav/ui/BottomNav";
import Footer from "@/widgets/footer/ui/Footer";
import Header from "@/widgets/header/ui/Header";
import HeaderBackButton from "@/widgets/header/ui/HeaderBackButton";

interface StatusScreenProps {
	kind: StatusKind;
	session: Nullable<Session>;
	reset?: () => void;
}

/**
 * 상태 > 화면 뼈대
 *
 * - 헤더, 상태 본문, 푸터, 하단 내비게이션을 흰 열 안에 출력
 * - 어느 화면에서 나왔는지 몰라 헤더 로그인 링크가 돌아올 경로는 홈
 * - 하단 내비게이션은 현재 경로가 탭과 맞지 않아 활성 탭이 없음
 *
 * @param reset 오류 경계(error.tsx)가 넘겨 주는 복구 함수
 */
export default function StatusScreen({
	kind,
	session,
	reset,
}: StatusScreenProps) {
	const style = statusScreenStyles;

	return (
		<VStack {...style.page}>
			<VStack data-area="page-column" {...style.column}>
				<Header
					session={session}
					currentPath={paths.home}
					mobileBack={<HeaderBackButton />}
				/>
				<VStack as="main" data-area="main" {...style.main}>
					<StatusPanel kind={kind} reset={reset} />
				</VStack>
				<Footer />
				<BottomNav session={session} />
			</VStack>
		</VStack>
	);
}
