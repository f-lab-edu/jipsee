import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getNearbyDeals } from "@/entities/building/api/getNearbyDeals";
import { nearbyDealsOptions } from "@/entities/building/config/nearbyDealsOptions";

const jeonseCondition = nearbyDealsOptions.defaultCondition;
const wolseCondition = { ...jeonseCondition, type: "wolse" } as const;

describe("getNearbyDeals", () => {
	it("거래가 없는 건물이면 빈 목록을 반환함", async () => {
		expect(await getNearbyDeals("11440-망원동-16-2", jeonseCondition)).toEqual({
			deals: [],
			hasNext: false,
			totalCount: 0,
		});
	});

	it("목업에 없는 id를 조회하면 빈 목록을 반환함", async () => {
		expect(await getNearbyDeals("11440-망원동-999-9", jeonseCondition)).toEqual(
			{
				deals: [],
				hasNext: false,
				totalCount: 0,
			},
		);
	});

	it("조건의 유형과 같은 유형의 거래만 반환함", async () => {
		for (const condition of [jeonseCondition, wolseCondition]) {
			const result = await getNearbyDeals("11440-망원동-12-3", condition);

			expect(result.deals.length).toBeGreaterThan(0);
			expect(result.totalCount).toBe(result.deals.length);
			expect(result.hasNext).toBe(false);
			expect(result.deals.every((deal) => deal.type === condition.type)).toBe(
				true,
			);
		}
	});

	describe("API_URL이 있으면", () => {
		const fetchMock = vi.fn();
		const body = {
			deals: [
				{
					id: 7,
					type: "wolse",
					buildingName: "한강빌라",
					month: { year: 2026, month: 7 },
					contract: "new",
					exclusiveArea: 40,
					amount: 1000,
					monthlyRent: 60,
				},
			],
			hasNext: true,
			totalCount: 21,
		};

		beforeEach(() => {
			vi.stubEnv("API_URL", "http://backend.test/");
			fetchMock.mockReset();
			vi.stubGlobal("fetch", fetchMock);
		});

		afterEach(() => {
			vi.unstubAllEnvs();
			vi.unstubAllGlobals();
		});

		it("기간, 유형, 페이지를 쿼리로 백엔드를 조회하고 data 필드를 반환함", async () => {
			fetchMock.mockResolvedValue(Response.json({ data: body }));

			const result = await getNearbyDeals(
				"11440-망원동-12-3",
				wolseCondition,
				1,
			);

			expect(fetchMock.mock.calls[0][0]).toBe(
				`http://backend.test/buildings/${encodeURIComponent("11440-망원동-12-3")}/nearby-deals?period=${wolseCondition.period}&type=wolse&page=1`,
			);
			expect(result).toEqual(body);
		});

		it.each([400, 404, 429, 500])(
			"%s 응답이면 거래 없음을 반환함",
			async (status) => {
				fetchMock.mockResolvedValue(Response.json({}, { status }));

				expect(
					await getNearbyDeals("11440-망원동-12-3", jeonseCondition),
				).toEqual({ deals: [], hasNext: false, totalCount: 0 });
			},
		);

		it("호출에 실패하면 거래 없음을 반환함", async () => {
			fetchMock.mockRejectedValue(new Error("network"));

			expect(
				await getNearbyDeals("11440-망원동-12-3", jeonseCondition),
			).toEqual({
				deals: [],
				hasNext: false,
				totalCount: 0,
			});
		});
	});
});
