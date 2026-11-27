import type { BuildingSearchResponse } from "@/entities/building/api/buildingSearchResponse";
import type { BuildingSearchResult } from "@/entities/building/model/buildingSearchResult";
import type { ApiResponse } from "@/shared/api/apiResponse";
import { getFromBackend } from "@/shared/api/getFromBackend";
import type { ProblemDetailResponse } from "@/shared/api/problemDetailResponse";

/**
 * 건물 > 백엔드 검색
 *
 * - 검색어와 페이지를 쿼리로 보내 호출하고 페이지 크기는 서버가 정함
 * - 2xx이면 data 필드로 found 반환
 * - 400이고 오류 코드가 KEYWORD_TOO_SHORT이면 queryTooShort 반환
 * - 429이면 rateLimited 반환
 * - 그 밖의 2xx가 아닌 응답과 호출 실패는 failed 반환
 *
 * @param page 0부터 시작하는 페이지 번호
 */
export async function fetchBuildingSearch(
	keyword: string,
	page: number,
): Promise<BuildingSearchResult> {
	try {
		const response = await getFromBackend(
			`/buildings?keyword=${encodeURIComponent(keyword)}&page=${page}`,
		);

		if (response.status === 429) {
			return { kind: "rateLimited" };
		}

		if (response.status === 400) {
			const problem: ProblemDetailResponse = await response.json();

			return problem.code === "KEYWORD_TOO_SHORT"
				? { kind: "queryTooShort" }
				: { kind: "failed" };
		}

		if (!response.ok) {
			return { kind: "failed" };
		}

		const body: ApiResponse<BuildingSearchResponse> = await response.json();

		return { kind: "found", ...body.data };
	} catch {
		return { kind: "failed" };
	}
}
