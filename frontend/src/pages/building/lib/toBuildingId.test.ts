import { describe, expect, it } from "vitest";
import { toBuildingId } from "@/pages/building/lib/toBuildingId";

describe("toBuildingId", () => {
	it("양의 정수 문자열이면 숫자로 바꿈", () => {
		expect(toBuildingId("1")).toBe(1);
		expect(toBuildingId("12")).toBe(12);
	});

	it("양의 정수 형식이 아니면 null을 반환함", () => {
		for (const value of ["0", "01", "1.5", "-1", "1e3", "abc", ""]) {
			expect(toBuildingId(value)).toBeNull();
		}
	});
});
