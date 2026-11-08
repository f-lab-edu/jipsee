import { describe, expect, it } from "vitest";
import { toNearbyCondition } from "@/pages/building/lib/toNearbyCondition";

describe("toNearbyCondition", () => {
	it("쿼리가 없으면 기본 조건을 반환함", () => {
		expect(toNearbyCondition({})).toEqual({
			radius: 500,
			period: 12,
			type: "jeonse",
		});
	});

	it("모두 허용 값이면 그대로 반환함", () => {
		expect(
			toNearbyCondition({ radius: "300", period: "24", type: "wolse" }),
		).toEqual({ radius: 300, period: 24, type: "wolse" });
	});

	it("허용 값이 아닌 항목만 기본값으로 바꾸고 나머지는 유지함", () => {
		expect(toNearbyCondition({ radius: "700", period: "24" })).toEqual({
			radius: 500,
			period: 24,
			type: "jeonse",
		});
	});

	it("같은 쿼리가 두 번 오면 그 항목만 기본값으로 바꿈", () => {
		expect(toNearbyCondition({ radius: ["300", "1000"], period: "6" })).toEqual(
			{ radius: 500, period: 6, type: "jeonse" },
		);
	});

	it("허용하지 않는 유형이면 전세로 바꿈", () => {
		expect(toNearbyCondition({ type: "sale" }).type).toBe("jeonse");
	});

	it("빈 값이거나 형식이 다르면 기간을 12로 바꿈", () => {
		expect(toNearbyCondition({ period: "" }).period).toBe(12);
		expect(toNearbyCondition({ period: "06" }).period).toBe(12);
	});
});
