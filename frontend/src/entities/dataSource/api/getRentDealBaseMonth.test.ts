import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getRentDealBaseMonth } from "@/entities/dataSource/api/getRentDealBaseMonth";

describe("getRentDealBaseMonth", () => {
	afterEach(() => {
		vi.unstubAllEnvs();
		vi.unstubAllGlobals();
	});

	it("API_URL이 없으면 백엔드를 부르지 않고 목업의 RENT_DEAL 기준 월을 반환함", async () => {
		vi.stubEnv("API_URL", "");
		const fetchMock = vi.fn();
		vi.stubGlobal("fetch", fetchMock);

		expect(await getRentDealBaseMonth()).toEqual({ year: 2026, month: 9 });
		expect(fetchMock).not.toHaveBeenCalled();
	});

	describe("API_URL이 있으면", () => {
		const fetchMock = vi.fn();

		beforeEach(() => {
			vi.stubEnv("API_URL", "http://backend.test");
			fetchMock.mockReset();
			vi.stubGlobal("fetch", fetchMock);
		});

		it("/data-sources 응답의 RENT_DEAL 기준 월을 반환함", async () => {
			fetchMock.mockResolvedValue(
				Response.json({
					data: [
						{ source: "RENT_DEAL", baseMonth: { year: 2026, month: 11 } },
						{ source: "SALE_DEAL", baseMonth: { year: 2026, month: 10 } },
					],
				}),
			);

			expect(await getRentDealBaseMonth()).toEqual({ year: 2026, month: 11 });
			expect(fetchMock.mock.calls[0][0]).toBe(
				"http://backend.test/data-sources",
			);
		});

		it("응답에 RENT_DEAL 행이 없으면 null을 반환함", async () => {
			fetchMock.mockResolvedValue(
				Response.json({
					data: [{ source: "SALE_DEAL", baseMonth: { year: 2026, month: 10 } }],
				}),
			);

			expect(await getRentDealBaseMonth()).toBeNull();
		});
	});
});
