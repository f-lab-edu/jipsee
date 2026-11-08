import { describe, expect, it } from "vitest";
import { toNearbyFilterHref } from "@/features/filterNearbyDeals/lib/toNearbyFilterHref";

const condition = { radius: 1000, period: 24, type: "wolse" } as const;

describe("toNearbyFilterHref", () => {
	it("유형만 바꾸면 반경과 기간을 유지함", () => {
		expect(toNearbyFilterHref(1, condition, { type: "jeonse" })).toBe(
			"/buildings/1?radius=1000&period=24&type=jeonse",
		);
	});

	it("반경만 바꾸면 기간과 유형을 유지함", () => {
		expect(toNearbyFilterHref(7, condition, { radius: 300 })).toBe(
			"/buildings/7?radius=300&period=24&type=wolse",
		);
	});

	it("기간만 바꾸면 반경과 유형을 유지함", () => {
		expect(toNearbyFilterHref(1, condition, { period: 6 })).toBe(
			"/buildings/1?radius=1000&period=6&type=wolse",
		);
	});
});
