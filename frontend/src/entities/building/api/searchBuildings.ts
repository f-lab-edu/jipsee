import { buildingSummaryMock } from "@/entities/building/api/buildingSummaryMock";
import type { BuildingSearchResult } from "@/entities/building/model/buildingSearchResult";

/**
 * 건물 > 검색
 *
 * - 검색어가 2자 미만이면 queryTooShort 반환
 * - 모든 단어가 건물명과 주소에 포함된 건물 목록 반환
 * - 백엔드가 없어 목업이 검색 규칙을 대신함
 */
export async function searchBuildings(
	keyword: string,
): Promise<BuildingSearchResult> {
	if (keyword.length < 2) {
		return { kind: "queryTooShort" };
	}

	const words = keyword.split(/\s+/);
	const buildings = buildingSummaryMock.filter((building) =>
		words.every((word) =>
			`${building.name ?? ""} ${building.address}`.includes(word),
		),
	);

	return { kind: "found", buildings };
}
