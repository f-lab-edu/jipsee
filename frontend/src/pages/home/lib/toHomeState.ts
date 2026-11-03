import type { BuildingSearchResult } from "@/entities/building/model/buildingSearchResult";
import type { HomeState } from "@/pages/home/model/homeState";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

/**
 * 홈 > 화면 상태 변환
 *
 * - 검색어가 비었거나 검색 결과가 없으면 beforeSearch 반환
 * - 검색어가 2자 미만이면 queryTooShort 반환
 * - 건물이 1건 이상이면 found 반환
 * - 건물이 0건이면 noResult 반환
 */
export function toHomeState(
	keyword: string,
	result: Nullable<BuildingSearchResult>,
): HomeState {
	if (keyword === "" || result === null) {
		return "beforeSearch";
	}

	if (result.kind === "queryTooShort") {
		return "queryTooShort";
	}

	if (result.buildings.length === 0) {
		return "noResult";
	}

	return "found";
}
