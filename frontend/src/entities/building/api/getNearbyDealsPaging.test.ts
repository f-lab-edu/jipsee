import { describe, expect, it, vi } from "vitest";
import { getNearbyDeals } from "@/entities/building/api/getNearbyDeals";
import { nearbyDealsOptions } from "@/entities/building/config/nearbyDealsOptions";
import type { NearbyDeal } from "@/entities/building/model/nearbyDeal";

vi.mock("@/entities/building/api/nearbyDealsMock", () => {
	const deals: NearbyDeal[] = Array.from({ length: 45 }, (_, index) => ({
		id: index + 1,
		type: "jeonse",
		buildingName: "한강빌라",
		month: { year: 2026, month: 7 },
		contract: "new",
		exclusiveArea: 40,
		amount: 24000,
		monthlyRent: null,
	}));

	return {
		nearbyDealsMock: { "11440-망원동-12-3": { jeonse: deals, wolse: [] } },
	};
});

const condition = nearbyDealsOptions.defaultCondition;
const id = "11440-망원동-12-3";

describe("getNearbyDeals 페이지 나눔", () => {
	it("0번 페이지는 앞의 20건과 hasNext true, 전체 건수를 반환함", async () => {
		const result = await getNearbyDeals(id, condition, 0);

		expect(result.deals.map((deal) => deal.id)).toEqual(
			Array.from({ length: 20 }, (_, index) => index + 1),
		);
		expect(result.hasNext).toBe(true);
		expect(result.totalCount).toBe(45);
	});

	it("page를 생략하면 0번 페이지를 반환함", async () => {
		expect(await getNearbyDeals(id, condition)).toEqual(
			await getNearbyDeals(id, condition, 0),
		);
	});

	it("마지막 페이지는 남은 건만 반환하고 hasNext가 false이며 전체 건수는 같음", async () => {
		const result = await getNearbyDeals(id, condition, 2);

		expect(result.deals.map((deal) => deal.id)).toEqual([41, 42, 43, 44, 45]);
		expect(result.hasNext).toBe(false);
		expect(result.totalCount).toBe(45);
	});
});
