import { getSession } from "@/entities/session/api/getSession";
import PageColumn from "@/shared/ui/PageColumn";
import BottomNav from "@/widgets/bottomNav/ui/BottomNav";
import Footer from "@/widgets/footer/ui/Footer";

/**
 * 집사 > 레이아웃
 *
 * - 페이지 내용 아래에 푸터 출력
 * - 모바일 질문 입력 바가 푸터 위에 놓이도록 질문 입력 바를 내용 안에 둠
 * - 1280 미만에서 열은 흰색이고, 열의 마지막 자식으로 하단 내비게이션 출력
 */
export default async function ChatLayout({ children }: LayoutProps<"/">) {
	const session = await getSession();

	return (
		<PageColumn>
			{children}
			<Footer />
			<BottomNav session={session} />
		</PageColumn>
	);
}
