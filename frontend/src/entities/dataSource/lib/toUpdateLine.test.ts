import { describe, expect, it } from "vitest";
import { toUpdateLine } from "@/entities/dataSource/lib/toUpdateLine";

describe("toUpdateLine", () => {
	it("기준 월이 있으면 주기와 기준 월을 함께 반환함", () => {
		expect(toUpdateLine("매일", { year: 2026, month: 9 })).toBe(
			"매일 갱신, 2026.09 기준",
		);
	});

	it("기준 월이 없으면 기준 글자 없이 주기만 반환함", () => {
		expect(toUpdateLine("개정 시", null)).toBe("개정 시 갱신");
	});
});
