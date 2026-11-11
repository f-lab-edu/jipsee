import { Grid, GridItem, VStack } from "@seed-design/react";
import type { ReactNode } from "react";
import type { Session } from "@/entities/session/model/session";
import ChatPanelDesktop from "@/features/askChatbot/ui/ChatPanelDesktop";
import ChatPanelMobile from "@/features/askChatbot/ui/ChatPanelMobile";
import { homeScreenStyles } from "@/pages/home/config/homeScreenStyles";
import { colors } from "@/shared/config/colors";
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
 * - 데스크톱 aside 셀에 데스크톱 챗봇 패널 출력
 * - main 아래에 푸터, 푸터 아래에 모바일 펼침 패널 출력
 */
export default function HomeScreen({ session, children }: HomeScreenProps) {
	const style = homeScreenStyles;

	return (
		<>
			<Header
				session={session}
				currentPath={paths.home}
				mobileBackground={colors.brandTintBackground}
			/>
			<VStack as="main" data-area="main" {...style.main}>
				<ContentContainer>
					<Grid {...style.grid}>
						<GridItem {...style.bodyCell}>
							<VStack data-area="body" {...style.body}>
								{children}
							</VStack>
						</GridItem>
						<GridItem {...style.asideCell}>
							<ChatPanelDesktop session={session} />
						</GridItem>
					</Grid>
				</ContentContainer>
			</VStack>
			<Footer />
			<ChatPanelMobile session={session} layout="expanded" />
		</>
	);
}
