import { getSession } from "@/entities/session/api/getSession";
import PageColumn from "@/shared/ui/PageColumn";
import BottomNav from "@/widgets/bottomNav/ui/BottomNav";

/**
 * 홈 > 레이아웃
 *
 * - 푸터는 모바일 챗봇 바 아래에 놓여야 하므로 각 화면이 출력
 * - 1280 미만에서 열은 흰색이고, 열의 마지막 자식으로 하단 내비게이션 출력
 */
export default async function HomeLayout({ children }: LayoutProps<"/">) {
	const session = await getSession();

	return (
		<PageColumn>
			{children}
			<BottomNav session={session} />
		</PageColumn>
	);
}
