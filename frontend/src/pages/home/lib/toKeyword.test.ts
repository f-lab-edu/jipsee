import { describe, expect, it } from "vitest";
import { toKeyword } from "@/pages/home/lib/toKeyword";

describe("toKeyword", () => {
	it("문자열이면 앞뒤 공백을 제거해 반환함", () => {
		expect(toKeyword("  서울 아파트  ")).toBe("서울 아파트");
	});

	it("문자열이 아니면 빈 문자열을 반환함", () => {
		expect(toKeyword(["서울", "부산"])).toBe("");
		expect(toKeyword(undefined)).toBe("");
	});
});
