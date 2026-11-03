import { searchBuildings } from "@/entities/building/api/searchBuildings";
import type { BuildingSearchResult } from "@/entities/building/model/buildingSearchResult";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

/**
 * 홈 > 검색어가 있을 때만 건물 검색
 *
 * - 검색어가 비었으면 검색하지 않고 null 반환
 * - 검색어가 있으면 검색 결과 반환
 */
export async function searchBuildingsIfPresent(
	keyword: string,
): Promise<Nullable<BuildingSearchResult>> {
	if (keyword === "") {
		return null;
	}

	return searchBuildings(keyword);
}
