// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { backendPaths } from "@/entities/session/api/backendPaths";
import { relayToBackend } from "@/entities/session/api/relayToBackend";

const REQUEST_URL = "http://localhost:3000/api/auth/logout";

function createRequest(headers: Record<string, string>): Request {
	return new Request(REQUEST_URL, { method: "POST", headers });
}

function createUpstream(status: number, cookies: string[]): Response {
	const headers = new Headers();
	for (const cookie of cookies) {
		headers.append("set-cookie", cookie);
	}
	return new Response(null, { status, headers });
}

describe("relayToBackend", () => {
	const fetchMock = vi.fn();

	beforeEach(() => {
		vi.stubEnv("API_URL", "http://backend:8080");
		vi.stubGlobal("fetch", fetchMock);
	});

	afterEach(() => {
		vi.unstubAllEnvs();
		vi.unstubAllGlobals();
		fetchMock.mockReset();
	});

	it("Origin이 요청 주소와 다른 출처이면 백엔드를 호출하지 않고 403을 반환함", async () => {
		const response = await relayToBackend(
			createRequest({ origin: "https://evil.example" }),
			backendPaths.logout,
		);

		expect(response.status).toBe(403);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it("Origin이 없으면 백엔드를 호출하지 않고 403을 반환함", async () => {
		const response = await relayToBackend(
			createRequest({}),
			backendPaths.logout,
		);

		expect(response.status).toBe(403);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it("요청의 Cookie를 실어 API_URL과 경로로 수동 리다이렉트 호출함", async () => {
		fetchMock.mockResolvedValue(createUpstream(302, []));

		await relayToBackend(
			createRequest({ origin: "http://localhost:3000", cookie: "SESSION=abc" }),
			backendPaths.withdraw,
		);

		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe("http://backend:8080/api/users/me");
		expect(init.method).toBe("DELETE");
		expect(new Headers(init.headers).get("cookie")).toBe("SESSION=abc");
		expect(init.redirect).toBe("manual");
		expect(init.signal).toBeInstanceOf(AbortSignal);
	});

	it("백엔드가 302에 Set-Cookie 두 개를 주면 둘 다 옮기고 홈으로 303을 반환함", async () => {
		fetchMock.mockResolvedValue(
			createUpstream(302, [
				"SESSION=; Max-Age=0; Path=/",
				"remember-me=; Max-Age=0; Path=/",
			]),
		);

		const response = await relayToBackend(
			createRequest({ origin: "http://localhost:3000" }),
			backendPaths.logout,
		);

		expect(response.status).toBe(303);
		expect(response.headers.get("location")).toBe("/");
		expect(response.headers.getSetCookie()).toEqual([
			"SESSION=; Max-Age=0; Path=/",
			"remember-me=; Max-Age=0; Path=/",
		]);
	});

	it.each([500, 403])(
		"백엔드가 %i을 주면 Set-Cookie를 옮기지 않고 502를 반환함",
		async (status) => {
			fetchMock.mockResolvedValue(
				createUpstream(status, ["SESSION=; Max-Age=0; Path=/"]),
			);

			const response = await relayToBackend(
				createRequest({ origin: "http://localhost:3000" }),
				backendPaths.logout,
			);

			expect(response.status).toBe(502);
			expect(response.headers.getSetCookie()).toEqual([]);
		},
	);

	it("fetch가 예외를 던지면 502를 반환함", async () => {
		fetchMock.mockRejectedValue(new Error("timeout"));

		const response = await relayToBackend(
			createRequest({ origin: "http://localhost:3000" }),
			backendPaths.logout,
		);

		expect(response.status).toBe(502);
	});

	it("API_URL이 없으면 백엔드를 호출하지 않고 500을 반환함", async () => {
		vi.stubEnv("API_URL", "");

		const response = await relayToBackend(
			createRequest({ origin: "http://localhost:3000" }),
			backendPaths.logout,
		);

		expect(response.status).toBe(500);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
