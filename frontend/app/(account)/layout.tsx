import { VStack } from "@seed-design/react";
import { getSession } from "@/entities/session/api/getSession";
import BottomNav from "@/widgets/bottomNav/ui/BottomNav";
import Footer from "@/widgets/footer/ui/Footer";

/**
 * 계정 > 레이아웃
 *
 * - 페이지 내용 아래에 푸터 출력
 * - 고정 헤더가 푸터까지 따라오도록 내용을 이 열의 직접 자식으로 둠
 * - 1280 미만은 한 열로 두고, md 이상에서 열 폭을 720까지 넓힘
 * - 바깥 열의 마지막 자식으로 하단 내비게이션 출력
 */
export default async function AccountLayout({ children }: LayoutProps<"/">) {
	const session = await getSession();

	return (
		<VStack minHeight="100dvh">
			<VStack
				width="full"
				maxWidth={{ base: "480px", md: "720px", lg: "none" }}
				mx="auto"
				flexGrow={1}
			>
				{children}
				<Footer />
			</VStack>
			<BottomNav session={session} />
		</VStack>
	);
}
