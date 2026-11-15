import { afterEach, describe, expect, it, vi } from "vitest";
import { getApiUrl } from "@/shared/api/apiUrl";

describe("getApiUrl", () => {
	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it.each([
		["http://backend:8080", "http://backend:8080"],
		["http://backend:8080/", "http://backend:8080"],
		["http://backend:8080//", "http://backend:8080"],
	])("%s에서 끝의 슬래시를 뺀 값을 반환함", (value, expected) => {
		vi.stubEnv("API_URL", value);

		expect(getApiUrl()).toBe(expected);
	});

	it("API_URL이 없으면 오류를 던짐", () => {
		vi.stubEnv("API_URL", "");

		expect(() => getApiUrl()).toThrow("API_URL");
	});
});
