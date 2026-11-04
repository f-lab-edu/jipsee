import { Box, VStack } from "@seed-design/react";
import { searchBuildings } from "@/entities/building/api/searchBuildings";
import { getRentDealBaseMonth } from "@/entities/dataSource/api/getRentDealBaseMonth";
import type { Session } from "@/entities/session/model/session";
import { searchPageStyles } from "@/pages/search/config/searchPageStyles";
import { toSearchState } from "@/pages/search/lib/toSearchState";
import HomeBackLink from "@/pages/search/ui/HomeBackLink";
import SearchPanel from "@/pages/search/ui/SearchPanel";
import SearchResult from "@/pages/search/ui/SearchResult";
import SearchScreen from "@/pages/search/ui/SearchScreen";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import SearchGuide from "@/widgets/searchGuide/ui/SearchGuide";

interface SearchPageProps {
	keyword: string;
	session: Nullable<Session>;
}

/**
 * 검색 > 페이지
 *
 * - 검색 결과로 화면 상태를 한 번 정해 상태별로 화면 구성
 * - 모든 상태에서 홈으로 링크와 검색 영역 출력
 * - found에서만 모바일 기준 월 안내와 검색 결과 목록 출력
 * - queryTooShort에서는 검색창에 오류 줄과 검색 안내 출력
 *
 * @param keyword 비어 있지 않은 검색어
 */
export default async function SearchPage({
	keyword,
	session,
}: SearchPageProps) {
	const style = searchPageStyles;
	const [baseMonth, result] = await Promise.all([
		getRentDealBaseMonth(),
		searchBuildings(keyword),
	]);
	const state = toSearchState(result);
	const invalid = state === "queryTooShort";

	if (state === "found") {
		return (
			<SearchScreen keyword={keyword} invalid={invalid} session={session}>
				<VStack {...style.panelGroup}>
					<HomeBackLink />
					<SearchPanel
						keyword={keyword}
						baseMonth={baseMonth}
						showsNoticeOnMobile
						invalid={invalid}
					/>
				</VStack>
				<SearchResult result={result} />
			</SearchScreen>
		);
	}

	if (state === "noResult") {
		return (
			<SearchScreen keyword={keyword} invalid={invalid} session={session}>
				<VStack {...style.panelGroup}>
					<HomeBackLink />
					<SearchPanel
						keyword={keyword}
						baseMonth={baseMonth}
						showsNoticeOnMobile={false}
						invalid={invalid}
					/>
				</VStack>
			</SearchScreen>
		);
	}

	return (
		<SearchScreen keyword={keyword} invalid={invalid} session={session}>
			<VStack {...style.panelGroup}>
				<HomeBackLink />
				<SearchPanel
					keyword={keyword}
					baseMonth={baseMonth}
					showsNoticeOnMobile={false}
					invalid={invalid}
				/>
			</VStack>
			<Box {...style.guideCell}>
				<SearchGuide baseMonth={baseMonth} />
			</Box>
		</SearchScreen>
	);
}
