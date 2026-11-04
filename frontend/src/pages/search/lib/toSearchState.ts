import type { BuildingSearchResult } from "@/entities/building/model/buildingSearchResult";
import type { SearchState } from "@/pages/search/model/searchState";

/**
 * 검색 > 화면 상태 변환
 *
 * - 검색어가 2자 미만이면 queryTooShort 반환
 * - 건물이 1건 이상이면 found 반환
 * - 건물이 0건이면 noResult 반환
 */
export function toSearchState(result: BuildingSearchResult): SearchState {
	if (result.kind === "queryTooShort") {
		return "queryTooShort";
	}

	if (result.buildings.length === 0) {
		return "noResult";
	}

	return "found";
}
