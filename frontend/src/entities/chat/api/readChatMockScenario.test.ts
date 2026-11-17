import { afterEach, describe, expect, it, vi } from "vitest";
import { readChatMockScenario } from "@/entities/chat/api/readChatMockScenario";

const cookieStore = vi.hoisted(() => ({ get: vi.fn() }));

vi.mock("next/headers", () => ({ cookies: async () => cookieStore }));

describe("readChatMockScenario", () => {
	afterEach(() => {
		cookieStore.get.mockReset();
		vi.unstubAllEnvs();
	});

	it("쿠키에 시나리오가 있으면 그 시나리오를 반환함", async () => {
		cookieStore.get.mockReturnValue({ value: "dailyLimit" });

		expect(await readChatMockScenario()).toBe("dailyLimit");
	});

	it("쿠키가 없으면 환경 변수의 시나리오를 반환함", async () => {
		vi.stubEnv("MOCK_CHAT", "noHistory");
		cookieStore.get.mockReturnValue(undefined);

		expect(await readChatMockScenario()).toBe("noHistory");
	});

	it("쿠키와 환경 변수가 없거나 알 수 없는 값이면 normal을 반환함", async () => {
		vi.stubEnv("MOCK_CHAT", "unknown");
		cookieStore.get.mockReturnValue({ value: "other" });

		expect(await readChatMockScenario()).toBe("normal");
	});

	it("운영 빌드에서는 쿠키가 있어도 normal을 반환하고 쿠키를 읽지 않음", async () => {
		vi.stubEnv("NODE_ENV", "production");
		cookieStore.get.mockReturnValue({ value: "dailyLimit" });

		expect(await readChatMockScenario()).toBe("normal");
		expect(cookieStore.get).not.toHaveBeenCalled();
	});
});
