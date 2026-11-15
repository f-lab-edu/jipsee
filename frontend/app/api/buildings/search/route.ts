import { searchBuildings } from "@/entities/building/api/searchBuildings";

export const dynamic = "force-dynamic";

/**
 * API > 건물 검색
 *
 * - keyword와 page 쿼리로 건물 검색
 * - 검색어가 2자 미만이면 400과 코드 KEYWORD_TOO_SHORT 반환
 * - 요청 제한이면 429와 코드 RATE_LIMITED, 호출 실패이면 502와 코드 SEARCH_FAILED 반환
 * - 그 밖에는 건물 목록과 hasNext 반환
 */
export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const keyword = searchParams.get("keyword") ?? "";
	const page = Number(searchParams.get("page") ?? 0);
	const result = await searchBuildings(keyword, page);

	if (result.kind === "queryTooShort") {
		return Response.json({ code: "KEYWORD_TOO_SHORT" }, { status: 400 });
	}

	if (result.kind === "rateLimited") {
		return Response.json({ code: "RATE_LIMITED" }, { status: 429 });
	}

	if (result.kind === "failed") {
		return Response.json({ code: "SEARCH_FAILED" }, { status: 502 });
	}

	return Response.json({
		buildings: result.buildings,
		hasNext: result.hasNext,
	});
}
