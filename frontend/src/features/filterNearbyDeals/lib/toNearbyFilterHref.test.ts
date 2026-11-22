import { describe, expect, it } from "vitest";
import { toNearbyFilterHref } from "@/features/filterNearbyDeals/lib/toNearbyFilterHref";

const condition = { period: 24, type: "wolse" } as const;

describe("toNearbyFilterHref", () => {
	it("유형만 바꾸면 기간을 유지함", () => {
		expect(toNearbyFilterHref(1, condition, { type: "jeonse" })).toBe(
			"/buildings/1?period=24&type=jeonse",
		);
	});

	it("기간만 바꾸면 유형을 유지함", () => {
		expect(toNearbyFilterHref(7, condition, { period: 6 })).toBe(
			"/buildings/7?period=6&type=wolse",
		);
	});
});
