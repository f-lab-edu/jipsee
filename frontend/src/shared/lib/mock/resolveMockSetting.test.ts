import { afterEach, describe, expect, it, vi } from "vitest";
import { resolveMockSetting } from "@/shared/lib/mock/resolveMockSetting";

const values = ["KAKAO", "GOOGLE", "none"] as const;

describe("resolveMockSetting", () => {
	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it("쿠키 값이 허용 목록에 있으면 쿠키 값을 반환함", () => {
		expect(
			resolveMockSetting({ cookieValue: "GOOGLE", envValue: "KAKAO", values }),
		).toBe("GOOGLE");
	});

	it("쿠키가 없으면 환경 변수 값을 반환함", () => {
		expect(
			resolveMockSetting({
				cookieValue: undefined,
				envValue: "KAKAO",
				values,
			}),
		).toBe("KAKAO");
	});

	it("쿠키 값이 허용 목록에 없으면 환경 변수 값을 반환함", () => {
		expect(
			resolveMockSetting({ cookieValue: "NAVER", envValue: "KAKAO", values }),
		).toBe("KAKAO");
	});

	it("쿠키와 환경 변수가 모두 허용 목록에 없으면 undefined를 반환함", () => {
		expect(
			resolveMockSetting({
				cookieValue: "NAVER",
				envValue: "naver",
				values,
			}),
		).toBeUndefined();
	});

	it("운영 빌드에서는 쿠키와 환경 변수가 있어도 undefined를 반환함", () => {
		vi.stubEnv("NODE_ENV", "production");

		expect(
			resolveMockSetting({ cookieValue: "GOOGLE", envValue: "KAKAO", values }),
		).toBeUndefined();
	});
});
