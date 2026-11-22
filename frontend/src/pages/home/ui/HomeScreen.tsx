import { Grid, GridItem, VStack } from "@seed-design/react";
import type { ReactNode } from "react";
import type { Session } from "@/entities/session/model/session";
import { homeScreenStyles } from "@/pages/home/config/homeScreenStyles";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import { paths } from "@/shared/routes/paths";
import ContentContainer from "@/shared/ui/ContentContainer";
import Footer from "@/widgets/footer/ui/Footer";
import Header from "@/widgets/header/ui/Header";

interface HomeScreenProps {
	session: Nullable<Session>;
	children: ReactNode;
}

/**
 * 홈 > 화면 뼈대
 *
 * - 하늘빛 모바일 헤더 배경으로 헤더 출력
 * - 본문 셀에 children 출력
 * - main 아래에 푸터 출력
 */
export default function HomeScreen({ session, children }: HomeScreenProps) {
	const style = homeScreenStyles;

	return (
		<>
			<Header session={session} currentPath={paths.home} />
			<VStack as="main" data-area="main" {...style.main}>
				<ContentContainer>
					<Grid {...style.grid}>
						<GridItem {...style.bodyCell}>
							<VStack data-area="body" {...style.body}>
								{children}
							</VStack>
						</GridItem>
					</Grid>
				</ContentContainer>
			</VStack>
			<Footer />
		</>
	);
}
