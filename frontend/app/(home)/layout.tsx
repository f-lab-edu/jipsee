import { VStack } from "@seed-design/react";
import Footer from "@/widgets/footer/ui/Footer";

/** 페이지 내용 아래에 푸터를 표시함 */
export default function HomeLayout({ children }: LayoutProps<"/">) {
	return (
		<VStack minHeight="100dvh">
			<VStack
				width="full"
				maxWidth={{ base: "480px", lg: "none" }}
				mx="auto"
				flexGrow={1}
			>
				<VStack flexGrow={1}>{children}</VStack>
				<Footer />
			</VStack>
		</VStack>
	);
}
