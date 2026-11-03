import { VStack } from "@seed-design/react";
import Footer from "@/widgets/footer/ui/Footer";

/**
 * 홈 > 레이아웃
 *
 * - 페이지 내용 아래에 푸터 출력
 * - 1280 미만은 한 열로 두고, md 이상에서 열 폭을 720까지 넓힘
 */
export default function HomeLayout({ children }: LayoutProps<"/">) {
	return (
		<VStack minHeight="100dvh">
			<VStack
				width="full"
				maxWidth={{ base: "480px", md: "720px", lg: "none" }}
				mx="auto"
				flexGrow={1}
			>
				<VStack flexGrow={1}>{children}</VStack>
				<Footer />
			</VStack>
		</VStack>
	);
}
