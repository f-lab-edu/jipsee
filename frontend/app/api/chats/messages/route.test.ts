// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const getSession = vi.hoisted(() => vi.fn());
const postChatMessage = vi.hoisted(() => vi.fn());

vi.mock("@/entities/session/api/getSession", () => ({ getSession }));
vi.mock("@/entities/chat/api/postChatMessage", () => ({ postChatMessage }));

const SITE_ORIGIN = "https://jipsee.example";

function createRequest(headers: Record<string, string>): Request {
	return new Request("http://127.0.0.1:3000/api/chats/messages", {
		method: "POST",
		headers,
	});
}

describe("POST /api/chats/messages", () => {
	beforeEach(() => {
		vi.stubEnv("SITE_URL", SITE_ORIGIN);
		getSession.mockResolvedValue({ provider: "kakao" });
		postChatMessage.mockResolvedValue(new Response("stream"));
	});

	afterEach(() => {
		vi.unstubAllEnvs();
		getSession.mockReset();
		postChatMessage.mockReset();
	});

	it.each([
		["다른 출처이면", { origin: "https://evil.example" }],
		["요청 주소의 내부 출처이면", { origin: "http://127.0.0.1:3000" }],
		["없으면", {}],
	])(
		"Origin이 %s 질문을 전송하지 않고 403을 반환함",
		async (_label, headers) => {
			const response = await POST(createRequest(headers));

			expect(response.status).toBe(403);
			expect(postChatMessage).not.toHaveBeenCalled();
		},
	);

	it("Origin이 SITE_URL과 같으면 질문을 전송함", async () => {
		const response = await POST(createRequest({ origin: SITE_ORIGIN }));

		expect(response.status).toBe(200);
		expect(postChatMessage).toHaveBeenCalledOnce();
	});

	it("로그인하지 않았으면 401을 반환함", async () => {
		getSession.mockResolvedValue(null);

		const response = await POST(createRequest({ origin: SITE_ORIGIN }));

		expect(response.status).toBe(401);
	});
});
