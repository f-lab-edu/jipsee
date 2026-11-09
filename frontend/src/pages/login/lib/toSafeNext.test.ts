import { describe, expect, it } from "vitest";
import { toSafeNext } from "@/pages/login/lib/toSafeNext";

describe("toSafeNext", () => {
	it("쿼리가 붙은 같은 사이트 경로는 그대로 반환함", () => {
		expect(toSafeNext("/buildings/3?radius=300")).toBe(
			"/buildings/3?radius=300",
		);
	});

	it.each([
		["다른 사이트 주소", "https://evil.example"],
		["슬래시 두 개로 시작하는 값", "//evil.example"],
		["슬래시와 역슬래시로 시작하는 값", "/\\evil.example"],
		["슬래시 사이에 탭이 있는 값", "/\t/evil.example"],
		["슬래시 사이에 줄바꿈이 있는 값", "/\n/evil.example"],
		["역슬래시가 든 값", "/a\\b"],
		["DEL 문자가 든 값", "/a\x7f"],
		["빈 값", ""],
		["값이 없음", undefined],
		["값이 둘인 배열", ["/a", "/b"]],
	])("%s이면 null을 반환함", (_, raw) => {
		expect(toSafeNext(raw)).toBeNull();
	});
});
