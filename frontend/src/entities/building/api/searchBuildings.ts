import { buildingSummaryMock } from "@/entities/building/api/buildingSummaryMock";
import type { BuildingSearchResult } from "@/entities/building/model/buildingSearchResult";

/** 검색어로 건물을 찾아 반환함. 백엔드가 없어 목업이 검색 규칙을 대신함 */
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
