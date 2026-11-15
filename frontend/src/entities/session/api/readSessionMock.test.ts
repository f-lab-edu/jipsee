import { afterEach, describe, expect, it, vi } from "vitest";
import { readSessionMock } from "@/entities/session/api/readSessionMock";

const cookieStore = vi.hoisted(() => ({ get: vi.fn() }));

vi.mock("next/headers", () => ({ cookies: async () => cookieStore }));

describe("readSessionMock", () => {
	afterEach(() => {
		cookieStore.get.mockReset();
		vi.unstubAllEnvs();
	});

	it("쿠키에 제공자가 있으면 그 제공자의 세션을 반환함", async () => {
		cookieStore.get.mockReturnValue({ value: "NAVER" });

		expect(await readSessionMock()).toEqual({ provider: "NAVER" });
	});

	it("쿠키가 none이면 환경 변수가 있어도 null을 반환함", async () => {
		vi.stubEnv("MOCK_SESSION", "KAKAO");
		cookieStore.get.mockReturnValue({ value: "none" });

		expect(await readSessionMock()).toBeNull();
	});

	it("쿠키가 없으면 환경 변수의 제공자로 세션을 반환함", async () => {
		vi.stubEnv("MOCK_SESSION", "GOOGLE");
		cookieStore.get.mockReturnValue(undefined);

		expect(await readSessionMock()).toEqual({ provider: "GOOGLE" });
	});

	it("쿠키도 환경 변수도 없으면 null을 반환함", async () => {
		vi.stubEnv("MOCK_SESSION", "");
		cookieStore.get.mockReturnValue(undefined);

		expect(await readSessionMock()).toBeNull();
	});

	it("운영 빌드에서는 쿠키가 있어도 null을 반환하고 쿠키를 읽지 않음", async () => {
		vi.stubEnv("NODE_ENV", "production");
		cookieStore.get.mockReturnValue({ value: "KAKAO" });

		expect(await readSessionMock()).toBeNull();
		expect(cookieStore.get).not.toHaveBeenCalled();
	});
});
