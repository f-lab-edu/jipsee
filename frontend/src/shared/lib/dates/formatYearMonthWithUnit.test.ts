import { describe, expect, it } from "vitest";
import { formatYearMonthWithUnit } from "@/shared/lib/dates/formatYearMonthWithUnit";

describe("formatYearMonthWithUnit", () => {
	it("한 자리 월은 0을 붙이지 않고 연월 단위로 표시함", () => {
		expect(formatYearMonthWithUnit({ year: 2026, month: 9 })).toBe(
			"2026년 9월",
		);
	});

	it("두 자리 월은 그대로 연월 단위로 표시함", () => {
		expect(formatYearMonthWithUnit({ year: 2026, month: 12 })).toBe(
			"2026년 12월",
		);
	});
});
