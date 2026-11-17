import type { BuildingSearchPage } from "@/entities/building/model/buildingSearchPage";
import { paths } from "@/shared/routes/paths";

/**
 * 건물 > 검색 페이지 조회
 *
 * - 브라우저에서 BFF를 호출해 keyword의 page번째 페이지 반환
 * - 응답이 실패이거나 연결에 실패하면 오류 발생
 *
 * @param page 0부터 시작하는 페이지 번호
 */
export async function fetchBuildingSearchPage(
	keyword: string,
	page: number,
): Promise<BuildingSearchPage> {
	const query = new URLSearchParams({ keyword, page: String(page) });
	const response = await fetch(`${paths.buildingsSearchApi}?${query}`);

	if (!response.ok) {
		throw new Error(`건물 검색 페이지 조회 실패: ${response.status}`);
	}

	return (await response.json()) as BuildingSearchPage;
}
