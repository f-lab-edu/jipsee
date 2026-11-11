import { describe, expect, it } from "vitest";
import { toAuthorizationHref } from "@/features/login/lib/toAuthorizationHref";

describe("toAuthorizationHref", () => {
	it("next가 없으면 제공자 경로만 반환함", () => {
		expect(toAuthorizationHref("KAKAO", null)).toBe(
			"/oauth2/authorization/kakao",
		);
	});

	it("next가 있으면 한 번만 인코딩해 붙임", () => {
		expect(
			toAuthorizationHref("GOOGLE", "/search?keyword=%EB%85%B8%EC%9B%90"),
		).toBe(
			"/oauth2/authorization/google?next=%2Fsearch%3Fkeyword%3D%25EB%2585%25B8%25EC%259B%2590",
		);
	});

	it("제공자마다 경로 조각이 다름", () => {
		expect(toAuthorizationHref("NAVER", "/me")).toBe(
			"/oauth2/authorization/naver?next=%2Fme",
		);
	});
});
