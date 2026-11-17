import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchBuildingSearchPage } from "@/entities/building/api/fetchBuildingSearchPage";

describe("fetchBuildingSearchPage", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("검색어와 페이지를 쿼리에 담아 요청하고 응답 본문을 반환함", async () => {
		const body = { buildings: [], hasNext: false };
		const fetchMock = vi.fn().mockResolvedValue(Response.json(body));
		vi.stubGlobal("fetch", fetchMock);

		const result = await fetchBuildingSearchPage("망원 동", 2);

		expect(fetchMock).toHaveBeenCalledWith(
			"/api/buildings/search?keyword=%EB%A7%9D%EC%9B%90+%EB%8F%99&page=2",
		);
		expect(result).toEqual(body);
	});

	it("응답이 실패이면 오류를 던짐", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(new Response(null, { status: 400 })),
		);

		await expect(fetchBuildingSearchPage("망원동", 1)).rejects.toThrow();
	});
});
