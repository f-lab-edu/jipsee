import { describe, expect, it } from "vitest";
import { toPositiveId } from "@/pages/chat/lib/toPositiveId";

describe("toPositiveId", () => {
	it("양의 정수 문자열이면 숫자를 반환함", () => {
		expect(toPositiveId("12")).toBe(12);
	});

	it.each(["0", "-1", "01", "1.5", "abc", ""])(
		"%s이면 null을 반환함",
		(value) => {
			expect(toPositiveId(value)).toBeNull();
		},
	);

	it("문자열이 아니면 null을 반환함", () => {
		expect(toPositiveId(undefined)).toBeNull();
		expect(toPositiveId(["1"])).toBeNull();
	});
});
