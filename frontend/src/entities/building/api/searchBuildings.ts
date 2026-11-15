import { buildingMockFailure } from "@/entities/building/api/buildingMockFailureSwitch";
import { buildingSummaryMock } from "@/entities/building/api/buildingSummaryMock";
import type { BuildingSearchResult } from "@/entities/building/model/buildingSearchResult";

/**
 * 건물 > 검색
 *
 * - 검색어가 2자 미만이면 queryTooShort 반환
 * - 백엔드가 429를 주면 rateLimited 반환
 * - 그 밖의 호출 실패는 failed 반환. 검색 결과 영역만 오류로 바꾸고 화면 전체는 유지하기 때문
 * - 모든 단어가 건물명과 주소에 포함된 건물 목록 반환
 * - 백엔드가 없어 목업이 검색 규칙을 대신하고, 요청 제한과 호출 실패는 목업 스위치로 만듦
 */
export async function searchBuildings(
	keyword: string,
): Promise<BuildingSearchResult> {
	if (keyword.length < 2) {
		return { kind: "queryTooShort" };
	}

	if (buildingMockFailure === "searchRateLimited") {
		return { kind: "rateLimited" };
	}

	if (buildingMockFailure === "searchFailed") {
		return { kind: "failed" };
	}

	const words = keyword.split(/\s+/);
	const buildings = buildingSummaryMock.filter((building) =>
		words.every((word) =>
			`${building.name ?? ""} ${building.address}`.includes(word),
		),
	);

	return { kind: "found", buildings };
}
