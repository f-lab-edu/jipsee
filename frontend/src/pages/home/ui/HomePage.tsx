import type { Session } from "@/entities/session/model/session";
import SearchForm from "@/features/searchBuildings/ui/SearchForm";
import { searchBuildingsIfPresent } from "@/pages/home/lib/searchBuildingsIfPresent";
import { toHomeState } from "@/pages/home/lib/toHomeState";
import HomeScreen from "@/pages/home/ui/HomeScreen";
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
 * - found에서만 검색 결과 목록 출력
 */
export default async function HomePage({ keyword, session }: HomePageProps) {
	const result = await searchBuildingsIfPresent(keyword);
	const state = toHomeState(keyword, result);

	if (state === "found" && result !== null) {
		return (
			<HomeScreen session={session} state={state}>
				<SearchForm key={keyword} defaultValue={keyword} />
				<SearchResult result={result} />
			</HomeScreen>
		);
	}

	return (
		<HomeScreen session={session} state={state}>
			<SearchForm key={keyword} defaultValue={keyword} />
		</HomeScreen>
	);
}
