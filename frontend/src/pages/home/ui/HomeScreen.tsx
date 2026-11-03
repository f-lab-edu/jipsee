import { Grid, GridItem, VStack } from "@seed-design/react";
import type { ReactNode } from "react";
import type { Session } from "@/entities/session/model/session";
import { homeScreenStyles } from "@/pages/home/config/homeScreenStyles";
import type { HomeState } from "@/pages/home/model/homeState";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import ContentContainer from "@/shared/ui/ContentContainer";
import Header from "@/widgets/header/ui/Header";

interface HomeScreenProps {
	session: Nullable<Session>;
	state: HomeState;
	children: ReactNode;
}

/**
 * 홈 > 화면 뼈대
 *
 * - 헤더와 본문 셀 출력
 * - 본문 셀에 children 출력
 */
export default function HomeScreen({ session, children }: HomeScreenProps) {
	const style = homeScreenStyles;

	return (
		<>
			<Header session={session} mobileBackground="bg.layerDefault" />
			<VStack as="main" {...style.main}>
				<ContentContainer>
					<Grid {...style.grid}>
						<GridItem {...style.bodyCell}>
							<VStack {...style.body}>{children}</VStack>
						</GridItem>
					</Grid>
				</ContentContainer>
			</VStack>
		</>
	);
}
