import { Box } from "@seed-design/react";
import { getRentDealBaseMonth } from "@/entities/dataSource/api/getRentDealBaseMonth";
import type { Session } from "@/entities/session/model/session";
import { homePageStyles } from "@/pages/home/config/homePageStyles";
import { searchBuildingsIfPresent } from "@/pages/home/lib/searchBuildingsIfPresent";
import { toHomeState } from "@/pages/home/lib/toHomeState";
import HomeScreen from "@/pages/home/ui/HomeScreen";
import IntroBand from "@/pages/home/ui/IntroBand";
import SearchGuide from "@/pages/home/ui/SearchGuide";
import SearchPanel from "@/pages/home/ui/SearchPanel";
import SearchResult from "@/pages/home/ui/SearchResult";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

interface HomePageProps {
	keyword: string;
	session: Nullable<Session>;
}

/**
 * 홈 > 페이지
 *
 * - 화면 상태를 한 번 정해 상태별로 화면 구성
 * - found와 noResult에서는 검색 영역 출력
 * - found에서만 검색 결과 목록 출력
 * - beforeSearch와 queryTooShort에서는 소개 영역과 검색 안내 출력
 */
export default async function HomePage({ keyword, session }: HomePageProps) {
	const style = homePageStyles;
	const [baseMonth, result] = await Promise.all([
		getRentDealBaseMonth(),
		searchBuildingsIfPresent(keyword),
	]);
	const state = toHomeState(keyword, result);

	if (state === "found" && result !== null) {
		return (
			<HomeScreen session={session} state={state}>
				<SearchPanel
					keyword={keyword}
					baseMonth={baseMonth}
					showsNoticeOnMobile
				/>
				<SearchResult result={result} />
			</HomeScreen>
		);
	}

	if (state === "noResult") {
		return (
			<HomeScreen session={session} state={state}>
				<SearchPanel
					keyword={keyword}
					baseMonth={baseMonth}
					showsNoticeOnMobile={false}
				/>
			</HomeScreen>
		);
	}

	return (
		<HomeScreen session={session} state={state}>
			<Box {...style.introWrapper}>
				<IntroBand keyword={keyword} />
				<SearchGuide baseMonth={baseMonth} />
			</Box>
		</HomeScreen>
	);
}
