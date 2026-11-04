import { Grid, GridItem, VStack } from "@seed-design/react";
import type { ReactNode } from "react";
import type { Session } from "@/entities/session/model/session";
import { searchScreenStyles } from "@/pages/search/config/searchScreenStyles";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import ContentContainer from "@/shared/ui/ContentContainer";
import SearchHeader from "@/widgets/header/ui/SearchHeader";

interface SearchScreenProps {
	keyword: string;
	session: Nullable<Session>;
	children: ReactNode;
}

/**
 * 검색 > 화면 뼈대
 *
 * - 검색어를 담은 검색 헤더 출력
 * - 본문 셀에 children 출력
 */
export default function SearchScreen({
	keyword,
	session,
	children,
}: SearchScreenProps) {
	const style = searchScreenStyles;

	return (
		<>
			<SearchHeader keyword={keyword} session={session} />
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
