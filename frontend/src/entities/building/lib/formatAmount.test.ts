import { describe, expect, it } from "vitest";
import { formatAmount } from "@/entities/building/lib/formatAmount";

describe("formatAmount", () => {
	it("천 단위마다 쉼표를 붙이고 만원을 붙임", () => {
		expect(formatAmount(25000)).toBe("25,000만원");
	});

	it("천 미만이면 쉼표 없이 만원을 붙임", () => {
		expect(formatAmount(900)).toBe("900만원");
	});
});
