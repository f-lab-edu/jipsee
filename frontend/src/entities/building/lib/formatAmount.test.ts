import { describe, expect, it } from "vitest";
import { formatAmount } from "@/entities/building/lib/formatAmount";

describe("formatAmount", () => {
	it("천 미만이면 쉼표 없이 만원을 붙임", () => {
		expect(formatAmount(900)).toBe("900만원");
	});

	it("1억 미만이면 쉼표를 붙이고 만원을 붙임", () => {
		expect(formatAmount(9500)).toBe("9,500만원");
	});

	it("1억 이상이면 억과 나머지 만원을 한 칸 띄워 출력함", () => {
		expect(formatAmount(18000)).toBe("1억 8,000만원");
		expect(formatAmount(25500)).toBe("2억 5,500만원");
	});

	it("나머지가 0이면 억만 출력함", () => {
		expect(formatAmount(20000)).toBe("2억");
		expect(formatAmount(100000)).toBe("10억");
	});
});
