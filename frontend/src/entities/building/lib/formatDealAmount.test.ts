import { describe, expect, it } from "vitest";
import { formatDealAmount } from "@/entities/building/lib/formatDealAmount";

describe("formatDealAmount", () => {
	it("전세는 월세 금액이 없으면 금액만 출력함", () => {
		expect(formatDealAmount("jeonse", 25000, null)).toBe("25,000만원");
	});

	it("전세에 월세 금액 0이 있어도 월 금액을 붙이지 않음", () => {
		expect(formatDealAmount("jeonse", 25000, 0)).toBe("25,000만원");
	});

	it("매매에 월세 금액이 있어도 월 금액을 붙이지 않음", () => {
		expect(formatDealAmount("sale", 31000, 50)).toBe("31,000만원");
	});

	it("월세는 보증금과 월 금액을 함께 출력함", () => {
		expect(formatDealAmount("wolse", 3000, 50)).toBe(
			"보증금 3,000만원 / 월 50만원",
		);
	});

	it("월세인데 월 금액이 null이면 보증금만 출력함", () => {
		expect(formatDealAmount("wolse", 3000, null)).toBe("보증금 3,000만원");
	});
});
