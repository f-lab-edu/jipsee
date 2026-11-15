// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const getSession = vi.hoisted(() => vi.fn());
const removeChat = vi.hoisted(() => vi.fn());

vi.mock("@/entities/session/api/getSession", () => ({ getSession }));
vi.mock("@/entities/chat/api/removeChat", () => ({ removeChat }));

const SITE_ORIGIN = "https://jipsee.example";

function createRequest(headers: Record<string, string>): Request {
	return new Request("http://127.0.0.1:3000/api/chat/1/delete", {
		method: "POST",
		headers,
	});
}

function createContext(chatId: string) {
	return { params: Promise.resolve({ chatId }) };
}

describe("POST /api/chat/[chatId]/delete", () => {
	beforeEach(() => {
		vi.stubEnv("SITE_URL", SITE_ORIGIN);
		getSession.mockResolvedValue({ provider: "kakao" });
		removeChat.mockResolvedValue({});
	});

	afterEach(() => {
		vi.unstubAllEnvs();
		getSession.mockReset();
		removeChat.mockReset();
	});

	it.each([
		["다른 출처이면", { origin: "https://evil.example" }],
		["요청 주소의 내부 출처이면", { origin: "http://127.0.0.1:3000" }],
		["없으면", {}],
	])(
		"Origin이 %s 삭제하지 않고 error 쿼리를 붙여 303을 반환함",
		async (_label, headers) => {
			const response = await POST(
				createRequest(headers),
				createContext("1") as never,
			);

			expect(response.status).toBe(303);
			expect(response.headers.get("location")).toBe(
				"/chat/history?error=chat-delete-failed",
			);
			expect(removeChat).not.toHaveBeenCalled();
		},
	);

	it("로그인하지 않았으면 삭제하지 않고 이동할 경로를 담아 로그인 화면으로 303을 반환함", async () => {
		getSession.mockResolvedValue(null);

		const response = await POST(
			createRequest({
				origin: SITE_ORIGIN,
				referer: `${SITE_ORIGIN}/chat/2`,
			}),
			createContext("1") as never,
		);

		expect(response.status).toBe(303);
		expect(response.headers.get("location")).toBe("/login?next=%2Fchat%2F2");
		expect(removeChat).not.toHaveBeenCalled();
	});

	it("삭제가 실패하면 Referer로 정한 경로에 error 쿼리를 붙여 303을 반환함", async () => {
		removeChat.mockRejectedValue(new Error("삭제 실패"));

		const response = await POST(
			createRequest({
				origin: SITE_ORIGIN,
				referer: `${SITE_ORIGIN}/chat/2`,
			}),
			createContext("1") as never,
		);

		expect(response.status).toBe(303);
		expect(response.headers.get("location")).toBe(
			"/chat/2?error=chat-delete-failed",
		);
	});

	it("Referer가 다른 출처이면 쓰지 않고 /chat/history로 보냄", async () => {
		const response = await POST(
			createRequest({
				origin: SITE_ORIGIN,
				referer: "https://evil.example/chat/2",
			}),
			createContext("1") as never,
		);

		expect(response.headers.get("location")).toBe("/chat/history");
	});

	it("번호가 양의 정수가 아니면 404를 반환함", async () => {
		const response = await POST(
			createRequest({ origin: SITE_ORIGIN }),
			createContext("abc") as never,
		);

		expect(response.status).toBe(404);
		expect(removeChat).not.toHaveBeenCalled();
	});

	it("Origin이 SITE_URL과 같으면 삭제하고 Referer로 정한 경로로 303을 반환함", async () => {
		const response = await POST(
			createRequest({
				origin: SITE_ORIGIN,
				referer: `${SITE_ORIGIN}/chat/2`,
			}),
			createContext("1") as never,
		);

		expect(removeChat).toHaveBeenCalledWith(1);
		expect(response.status).toBe(303);
		expect(response.headers.get("location")).toBe("/chat/2");
	});

	it("목업이 쿠키를 새로 만들면 Set-Cookie를 담음", async () => {
		removeChat.mockResolvedValue({ setCookie: "mock=1; Path=/" });

		const response = await POST(
			createRequest({ origin: SITE_ORIGIN }),
			createContext("1") as never,
		);

		expect(response.headers.get("location")).toBe("/chat/history");
		expect(response.headers.getSetCookie()).toEqual(["mock=1; Path=/"]);
	});
});
