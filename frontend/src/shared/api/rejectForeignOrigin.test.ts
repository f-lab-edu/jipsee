// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { rejectForeignOrigin } from "@/shared/api/rejectForeignOrigin";

// 프록시 뒤에서 요청 주소가 내부 주소로 보이는 상황
const INTERNAL_URL = "http://127.0.0.1:3000/api/auth/logout";

function createRequest(headers: Record<string, string>): Request {
	return new Request(INTERNAL_URL, { method: "POST", headers });
}

describe("rejectForeignOrigin", () => {
	beforeEach(() => {
		vi.stubEnv("SITE_URL", "https://jipsee.example");
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it("Origin이 SITE_URL의 출처와 같으면 요청 주소가 달라도 null을 반환함", () => {
		const result = rejectForeignOrigin(
			createRequest({ origin: "https://jipsee.example" }),
		);

		expect(result).toBeNull();
	});

	it("SITE_URL에 경로가 있어도 출처만 비교함", () => {
		vi.stubEnv("SITE_URL", "https://jipsee.example/app");

		const result = rejectForeignOrigin(
			createRequest({ origin: "https://jipsee.example" }),
		);

		expect(result).toBeNull();
	});

	it("Origin이 요청 주소의 출처이지만 SITE_URL의 출처가 아니면 403을 반환함", () => {
		const result = rejectForeignOrigin(
			createRequest({ origin: "http://127.0.0.1:3000" }),
		);

		expect(result?.status).toBe(403);
	});

	it("Origin이 없으면 403을 반환함", () => {
		const result = rejectForeignOrigin(createRequest({}));

		expect(result?.status).toBe(403);
	});
});
