import { describe, expect, it } from "vitest";
import { toNearbyFilterHref } from "@/features/filterNearbyDeals/lib/toNearbyFilterHref";

const condition = { period: 24, type: "wolse" } as const;

describe("toNearbyFilterHref", () => {
	it("유형만 바꾸면 기간을 유지함", () => {
		expect(
			toNearbyFilterHref("11440-망원동-12-3", condition, { type: "jeonse" }),
		).toBe(
			"/buildings/11440-%EB%A7%9D%EC%9B%90%EB%8F%99-12-3?period=24&type=jeonse",
		);
	});

	it("기간만 바꾸면 유형을 유지함", () => {
		expect(
			toNearbyFilterHref("11440-망원동-12-5", condition, { period: 6 }),
		).toBe(
			"/buildings/11440-%EB%A7%9D%EC%9B%90%EB%8F%99-12-5?period=6&type=wolse",
		);
	});
});
