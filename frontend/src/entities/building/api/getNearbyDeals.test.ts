import { describe, expect, it } from "vitest";
import { getNearbyDeals } from "@/entities/building/api/getNearbyDeals";
import { nearbyDealsOptions } from "@/entities/building/config/nearbyDealsOptions";

const jeonseCondition = nearbyDealsOptions.defaultCondition;
const wolseCondition = { ...jeonseCondition, type: "wolse" } as const;

describe("getNearbyDeals", () => {
	it("거래가 없는 건물이면 빈 목록을 반환함", async () => {
		expect(await getNearbyDeals("11440-망원동-16-2", jeonseCondition)).toEqual({
			areaConditionApplied: true,
			deals: [],
		});
	});

	it("목업에 없는 id를 조회하면 빈 목록을 반환함", async () => {
		expect(await getNearbyDeals("11440-망원동-999-9", jeonseCondition)).toEqual(
			{
				areaConditionApplied: false,
				deals: [],
			},
		);
	});

	it("조건의 유형과 같은 유형의 거래만 반환함", async () => {
		for (const condition of [jeonseCondition, wolseCondition]) {
			const result = await getNearbyDeals("11440-망원동-12-3", condition);

			expect(result.deals.length).toBeGreaterThan(0);
			expect(result.deals.every((deal) => deal.type === condition.type)).toBe(
				true,
			);
		}
	});
});
