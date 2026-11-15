import { buildingSummaryMock } from "@/entities/building/api/buildingSummaryMock";
import { readBuildingMockFailure } from "@/entities/building/api/readBuildingMockFailure";
import type { BuildingSearchResult } from "@/entities/building/model/buildingSearchResult";

const PAGE_SIZE = 20;

/**
 * 건물 > 검색
 *
 * - 검색어가 2자 미만이면 queryTooShort 반환
 * - 백엔드가 429를 주면 rateLimited 반환
 * - 그 밖의 호출 실패는 failed 반환. 검색 결과 영역만 오류로 바꾸고 화면 전체는 유지하기 때문
 * - 모든 단어가 건물명, 지번 주소, 도로명 주소에 포함된 건물 중 page번째 20건과 다음 페이지 유무 반환
 * - 백엔드가 없어 목업이 검색 규칙을 대신하고, 요청 제한과 호출 실패는 목업 스위치로 만듦
 *
 * @param page 0부터 시작하는 페이지 번호
 */
export async function searchBuildings(
	keyword: string,
	page = 0,
): Promise<BuildingSearchResult> {
	if (keyword.length < 2) {
		return { kind: "queryTooShort" };
	}

	const failure = await readBuildingMockFailure();

	if (failure === "searchRateLimited") {
		return { kind: "rateLimited" };
	}

	if (failure === "searchFailed") {
		return { kind: "failed" };
	}

	const words = keyword.split(/\s+/);
	const matched = buildingSummaryMock.filter((building) =>
		words.every((word) =>
			`${building.name ?? ""} ${building.lotAddress} ${building.roadAddress ?? ""}`.includes(
				word,
			),
		),
	);
	const start = page * PAGE_SIZE;

	return {
		kind: "found",
		buildings: matched.slice(start, start + PAGE_SIZE),
		hasNext: matched.length > start + PAGE_SIZE,
	};
}
