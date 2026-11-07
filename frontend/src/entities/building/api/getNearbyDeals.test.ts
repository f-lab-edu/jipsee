import { describe, expect, it } from "vitest";
import { getNearbyDeals } from "@/entities/building/api/getNearbyDeals";
import { nearbyDealsOptions } from "@/entities/building/config/nearbyDealsOptions";

const jeonseCondition = nearbyDealsOptions.defaultCondition;
const wolseCondition = { ...jeonseCondition, type: "wolse" } as const;

describe("getNearbyDeals", () => {
	it("위치 정보가 없는 건물이면 noLocation을 반환함", async () => {
		expect(await getNearbyDeals(4, jeonseCondition)).toEqual({
			kind: "noLocation",
		});
	});

	it("목업에 없는 id를 조회하면 noLocation을 반환함", async () => {
		expect(await getNearbyDeals(9999, jeonseCondition)).toEqual({
			kind: "noLocation",
		});
	});

	it("조건의 유형과 같은 유형의 거래만 반환함", async () => {
		for (const condition of [jeonseCondition, wolseCondition]) {
			const result = await getNearbyDeals(1, condition);

			if (result.kind !== "found") {
				throw new Error(`found가 아님: ${result.kind}`);
			}

			expect(result.deals.length).toBeGreaterThan(0);
			expect(result.deals.every((deal) => deal.type === condition.type)).toBe(
				true,
			);
		}
	});
});
