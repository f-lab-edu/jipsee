import { notFound } from "next/navigation";
import { getSession } from "@/entities/session/api/getSession";
import { phase2RoutesEnabled } from "@/shared/config/phase2Routes";
import PageColumn from "@/shared/ui/PageColumn";
import BottomNav from "@/widgets/bottomNav/ui/BottomNav";
import Footer from "@/widgets/footer/ui/Footer";

/**
 * 계정 > 레이아웃
 *
 * - phase2RoutesEnabled가 false이면 하위 경로 전체를 404로 처리
 * - 페이지 내용 아래에 푸터 출력
 * - 1280 미만에서 열은 흰색이고, 열의 마지막 자식으로 하단 내비게이션 출력
 */
export default async function AccountLayout({ children }: LayoutProps<"/">) {
	if (!phase2RoutesEnabled) {
		notFound();
	}

	const session = await getSession();

	return (
		<PageColumn>
			{children}
			<Footer />
			<BottomNav session={session} />
		</PageColumn>
	);
}
