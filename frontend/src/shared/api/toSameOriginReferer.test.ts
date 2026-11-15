// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { toSameOriginReferer } from "@/shared/api/toSameOriginReferer";

function createRequest(referer?: string): Request {
	return new Request("http://127.0.0.1:3000/api/chat/1/delete", {
		method: "POST",
		headers: referer === undefined ? {} : { referer },
	});
}

describe("toSameOriginReferer", () => {
	beforeEach(() => {
		vi.stubEnv("SITE_URL", "https://jipsee.example");
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it("Referer가 SITE_URL의 출처와 같으면 그 값을 반환함", () => {
		expect(
			toSameOriginReferer(createRequest("https://jipsee.example/chat/2")),
		).toBe("https://jipsee.example/chat/2");
	});

	it.each([
		["다른 출처이면", "https://evil.example/chat/2"],
		["주소가 아니면", "not a url"],
		["없으면", undefined],
	])("Referer가 %s null을 반환함", (_label, referer) => {
		expect(toSameOriginReferer(createRequest(referer))).toBeNull();
	});
});
