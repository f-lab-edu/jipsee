import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getDataSourceCards } from "@/entities/dataSource/api/getDataSourceCards";

describe("getDataSourceCards", () => {
	afterEach(() => {
		vi.unstubAllEnvs();
		vi.unstubAllGlobals();
	});

	describe("API_URL이 없으면", () => {
		beforeEach(() => {
			vi.stubEnv("API_URL", "");
		});

		it("백엔드를 부르지 않고 목업 기준 월로 카드를 만듦", async () => {
			const fetchMock = vi.fn();
			vi.stubGlobal("fetch", fetchMock);

			const cards = await getDataSourceCards();

			expect(fetchMock).not.toHaveBeenCalled();
			expect(cards.map((card) => card.source)).toEqual([
				"RENT_DEAL",
				"SALE_DEAL",
			]);
			expect(cards[0].baseMonth).toEqual({ year: 2026, month: 9 });
		});
	});

	describe("API_URL이 있으면", () => {
		const fetchMock = vi.fn();

		beforeEach(() => {
			vi.stubEnv("API_URL", "http://backend.test");
			fetchMock.mockReset();
			vi.stubGlobal("fetch", fetchMock);
		});

		it("백엔드의 data 필드 기준 월로 카드를 만듦", async () => {
			fetchMock.mockResolvedValue(
				Response.json({
					data: [
						{ source: "RENT_DEAL", baseMonth: { year: 2026, month: 11 } },
						{ source: "SALE_DEAL", baseMonth: { year: 2026, month: 10 } },
					],
				}),
			);

			const cards = await getDataSourceCards();

			expect(fetchMock.mock.calls[0][0]).toBe(
				"http://backend.test/data-sources",
			);
			expect(cards.map((card) => card.baseMonth)).toEqual([
				{ year: 2026, month: 11 },
				{ year: 2026, month: 10 },
			]);
		});

		it("2xx가 아닌 응답은 오류를 던짐", async () => {
			fetchMock.mockResolvedValue(Response.json({}, { status: 500 }));

			await expect(getDataSourceCards()).rejects.toThrow();
		});
	});
});
