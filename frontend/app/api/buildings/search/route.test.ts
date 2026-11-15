// @vitest-environment node
import { describe, expect, it } from "vitest";
import { GET } from "./route";

function createRequest(query: string): Request {
	return new Request(`http://127.0.0.1:3000/api/buildings/search?${query}`);
}

describe("GET /api/buildings/search", () => {
	it("검색어가 2자 미만이면 400과 KEYWORD_TOO_SHORT를 반환함", async () => {
		const response = await GET(createRequest("keyword=망&page=0"));

		expect(response.status).toBe(400);
		expect(await response.json()).toEqual({ code: "KEYWORD_TOO_SHORT" });
	});

	it("page 쿼리에 맞는 20건과 hasNext를 반환함", async () => {
		const response = await GET(createRequest("keyword=망원동&page=1"));
		const body = await response.json();

		expect(response.status).toBe(200);
		expect(body.buildings).toHaveLength(20);
		expect(body.buildings[0].id).toBe(21);
		expect(body.hasNext).toBe(true);
	});

	it("page가 없으면 0번 페이지를 반환함", async () => {
		const response = await GET(createRequest("keyword=망원동"));
		const body = await response.json();

		expect(body.buildings[0].id).toBe(1);
	});
});
