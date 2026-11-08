import { describe, expect, it } from "vitest";
import { toMonthPercent } from "@/pages/building/lib/toMonthPercent";

describe("toMonthPercent", () => {
	it("시작 연도 1월이면 0을 반환함", () => {
		expect(toMonthPercent({ year: 2012, month: 1 }, 2012, 179)).toBe(0);
	});

	it("끝 연도 12월이면 100을 반환함", () => {
		expect(toMonthPercent({ year: 2026, month: 12 }, 2012, 179)).toBe(100);
	});

	it("중간 월이면 시작 연도 1월부터 지난 개월 수의 비율을 반환함", () => {
		expect(toMonthPercent({ year: 2012, month: 3 }, 2012, 179)).toBeCloseTo(
			1.117,
			3,
		);
	});
});
