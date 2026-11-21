// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import robots from "./robots";

describe("robots.txt", () => {
	beforeEach(() => {
		vi.stubEnv("SITE_URL", "https://jipsee.example");
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it("모든 크롤러에 전체 경로를 허용하고 다른 규칙은 두지 않음", () => {
		expect(robots().rules).toEqual({ userAgent: "*", allow: "/" });
	});

	it("사이트맵 주소는 SITE_URL 기준의 절대 주소임", () => {
		expect(robots().sitemap).toBe("https://jipsee.example/sitemap.xml");
	});

	it("SITE_URL 끝에 슬래시가 있어도 슬래시가 겹치지 않음", () => {
		vi.stubEnv("SITE_URL", "https://jipsee.example/");

		expect(robots().sitemap).toBe("https://jipsee.example/sitemap.xml");
	});
});
