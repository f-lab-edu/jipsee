// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { backendPaths } from "@/entities/session/api/backendPaths";
import { relayToBackend } from "@/entities/session/api/relayToBackend";

// 프록시 뒤에서 요청 주소가 내부 주소로 보이는 상황
const REQUEST_URL = "http://127.0.0.1:3000/api/auth/logout";
const REQUEST_ORIGIN = "http://127.0.0.1:3000";
const SITE_ORIGIN = "https://jipsee.example";

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
		vi.stubEnv("SITE_URL", SITE_ORIGIN);
		vi.stubGlobal("fetch", fetchMock);
	});

	afterEach(() => {
		vi.unstubAllEnvs();
		vi.unstubAllGlobals();
		fetchMock.mockReset();
	});

	it.each([
		["SITE_URL과 다른 출처이면", { origin: "https://evil.example" }],
		["요청 주소의 출처와 같아도 SITE_URL과 다르면", { origin: REQUEST_ORIGIN }],
		["없으면", {}],
	])(
		"Origin이 %s 백엔드를 호출하지 않고 내 정보 화면으로 error 쿼리를 붙여 303을 반환함",
		async (_label, headers) => {
			const response = await relayToBackend(
				createRequest(headers),
				backendPaths.logout,
			);

			expect(response.status).toBe(303);
			expect(response.headers.get("location")).toBe("/me?error=logout-failed");
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);

	it("요청의 Cookie를 실어 API_URL과 경로로 수동 리다이렉트 호출함", async () => {
		fetchMock.mockResolvedValue(createUpstream(302, []));

		await relayToBackend(
			createRequest({ origin: SITE_ORIGIN, cookie: "SESSION=abc" }),
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
			createRequest({ origin: SITE_ORIGIN }),
			backendPaths.logout,
		);

		expect(response.status).toBe(303);
		expect(response.headers.get("location")).toBe("/");
		expect(response.headers.getSetCookie()).toEqual([
			"SESSION=; Max-Age=0; Path=/",
			"remember-me=; Max-Age=0; Path=/",
		]);
	});

	it("로그아웃은 백엔드가 302를 주면 성공으로 봄", async () => {
		fetchMock.mockResolvedValue(createUpstream(302, []));

		const response = await relayToBackend(
			createRequest({ origin: SITE_ORIGIN }),
			backendPaths.logout,
		);

		expect(response.status).toBe(303);
		expect(response.headers.get("location")).toBe("/");
	});

	it("탈퇴는 백엔드가 302를 주면 Set-Cookie를 옮기지 않고 withdraw-failed로 303을 반환함", async () => {
		fetchMock.mockResolvedValue(
			createUpstream(302, ["SESSION=; Max-Age=0; Path=/"]),
		);

		const response = await relayToBackend(
			createRequest({ origin: SITE_ORIGIN }),
			backendPaths.withdraw,
		);

		expect(response.status).toBe(303);
		expect(response.headers.get("location")).toBe("/me?error=withdraw-failed");
		expect(response.headers.getSetCookie()).toEqual([]);
	});

	it("탈퇴는 백엔드가 2xx를 주면 홈으로 303을 반환함", async () => {
		fetchMock.mockResolvedValue(
			createUpstream(204, ["SESSION=; Max-Age=0; Path=/"]),
		);

		const response = await relayToBackend(
			createRequest({ origin: SITE_ORIGIN }),
			backendPaths.withdraw,
		);

		expect(response.status).toBe(303);
		expect(response.headers.get("location")).toBe("/");
		expect(response.headers.getSetCookie()).toEqual([
			"SESSION=; Max-Age=0; Path=/",
		]);
	});

	it.each([
		["logout", 401],
		["logout", 403],
		["withdraw", 401],
		["withdraw", 403],
	] as const)(
		"%s에서 백엔드가 %i을 주면 Set-Cookie를 옮기지 않고 로그인 화면으로 303을 반환함",
		async (name, status) => {
			fetchMock.mockResolvedValue(
				createUpstream(status, ["SESSION=; Max-Age=0; Path=/"]),
			);

			const response = await relayToBackend(
				createRequest({ origin: SITE_ORIGIN }),
				backendPaths[name],
			);

			expect(response.status).toBe(303);
			expect(response.headers.get("location")).toBe("/login?next=%2Fme");
			expect(response.headers.getSetCookie()).toEqual([]);
		},
	);

	it.each([500, 404])(
		"백엔드가 %i을 주면 Set-Cookie를 옮기지 않고 logout-failed로 303을 반환함",
		async (status) => {
			fetchMock.mockResolvedValue(
				createUpstream(status, ["SESSION=; Max-Age=0; Path=/"]),
			);

			const response = await relayToBackend(
				createRequest({ origin: SITE_ORIGIN }),
				backendPaths.logout,
			);

			expect(response.status).toBe(303);
			expect(response.headers.get("location")).toBe("/me?error=logout-failed");
			expect(response.headers.getSetCookie()).toEqual([]);
		},
	);

	it("fetch가 예외를 던지면 logout-failed로 303을 반환함", async () => {
		fetchMock.mockRejectedValue(new Error("timeout"));

		const response = await relayToBackend(
			createRequest({ origin: SITE_ORIGIN }),
			backendPaths.logout,
		);

		expect(response.status).toBe(303);
		expect(response.headers.get("location")).toBe("/me?error=logout-failed");
	});

	it("API_URL이 없으면 백엔드를 호출하지 않고 withdraw-failed로 303을 반환함", async () => {
		vi.stubEnv("API_URL", "");

		const response = await relayToBackend(
			createRequest({ origin: SITE_ORIGIN }),
			backendPaths.withdraw,
		);

		expect(response.status).toBe(303);
		expect(response.headers.get("location")).toBe("/me?error=withdraw-failed");
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
