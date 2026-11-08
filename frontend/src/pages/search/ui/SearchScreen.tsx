import { Grid, GridItem, VStack } from "@seed-design/react";
import type { ReactNode } from "react";
import type { Session } from "@/entities/session/model/session";
import ChatPanelDesktop from "@/features/askChatbot/ui/ChatPanelDesktop";
import ChatPanelMobile from "@/features/askChatbot/ui/ChatPanelMobile";
import { searchScreenStyles } from "@/pages/search/config/searchScreenStyles";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import ContentContainer from "@/shared/ui/ContentContainer";
import SearchHeader from "@/widgets/header/ui/SearchHeader";

interface SearchScreenProps {
	keyword: string;
	invalid: boolean;
	session: Nullable<Session>;
	children: ReactNode;
}

/**
 * 검색 > 화면 뼈대
 *
 * - 검색어를 담은 검색 헤더 출력
 * - 본문 셀에 children 출력
 * - 데스크톱 aside 셀과 main 마지막 자식으로 모바일 축소 바 출력
 *
 * @param invalid 검색어가 2자 미만인지 여부. 헤더 검색창의 오류 줄 출력 여부
 */
export default function SearchScreen({
	keyword,
	invalid,
	session,
	children,
}: SearchScreenProps) {
	const style = searchScreenStyles;

	return (
		<>
			<SearchHeader keyword={keyword} invalid={invalid} session={session} />
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
				<ChatPanelMobile session={session} layout="compact" />
			</VStack>
		</>
	);
}
