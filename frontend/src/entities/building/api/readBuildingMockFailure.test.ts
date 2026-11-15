import { afterEach, describe, expect, it, vi } from "vitest";
import { readBuildingMockFailure } from "@/entities/building/api/readBuildingMockFailure";

const cookieStore = vi.hoisted(() => ({ get: vi.fn() }));

vi.mock("next/headers", () => ({ cookies: async () => cookieStore }));

describe("readBuildingMockFailure", () => {
	afterEach(() => {
		cookieStore.get.mockReset();
		vi.unstubAllEnvs();
	});

	it("쿠키에 실패 값이 있으면 그 값을 반환함", async () => {
		cookieStore.get.mockReturnValue({ value: "searchRateLimited" });

		expect(await readBuildingMockFailure()).toBe("searchRateLimited");
	});

	it("쿠키가 없으면 환경 변수의 값을 반환함", async () => {
		cookieStore.get.mockReturnValue(undefined);
		vi.stubEnv("MOCK_BUILDING", "buildingFailed");

		expect(await readBuildingMockFailure()).toBe("buildingFailed");
	});

	it("값이 없거나 알 수 없으면 none을 반환함", async () => {
		cookieStore.get.mockReturnValue({ value: "unknown" });

		expect(await readBuildingMockFailure()).toBe("none");
	});

	it("운영 빌드에서는 쿠키가 있어도 none을 반환함", async () => {
		cookieStore.get.mockReturnValue({ value: "buildingFailed" });
		vi.stubEnv("NODE_ENV", "production");

		expect(await readBuildingMockFailure()).toBe("none");
	});
});
