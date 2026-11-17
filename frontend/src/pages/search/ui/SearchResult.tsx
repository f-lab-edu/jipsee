import type { BuildingSearchResult } from "@/entities/building/model/buildingSearchResult";
import SearchResultList from "@/pages/search/ui/SearchResultList";

interface SearchResultProps {
	keyword: string;
	result: BuildingSearchResult;
}

/**
 * 검색 > 검색 결과
 *
 * - 결과가 found가 아니면 출력하지 않음
 * - 결과가 found이면 검색어가 바뀔 때마다 처음 20건부터 다시 시작하는 결과 목록 출력
 */
export default function SearchResult({ keyword, result }: SearchResultProps) {
	if (result.kind !== "found") {
		return null;
	}

	return (
		<SearchResultList
			key={keyword}
			keyword={keyword}
			buildings={result.buildings}
			hasNext={result.hasNext}
		/>
	);
}
