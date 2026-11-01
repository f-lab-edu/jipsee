import { Box, VStack } from "@seed-design/react";
import { getSession } from "@/entities/session/api/getSession";
import Footer from "@/widgets/footer/ui/Footer";
import Header from "@/widgets/header/ui/Header";

/** 세션을 조회해 헤더와 푸터 사이에 페이지 내용을 표시함 */
export default async function HomeLayout({ children }: LayoutProps<"/">) {
	const session = await getSession();

	return (
		<VStack minHeight="100dvh">
			<Header session={session} />
			<Box flexGrow={1}>{children}</Box>
			<Footer />
		</VStack>
	);
}
