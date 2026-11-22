// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import sitemap from "./sitemap";

describe("sitemap.xml", () => {
	beforeEach(() => {
		vi.stubEnv("SITE_URL", "https://jipsee.example");
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it("홈과 데이터 출처만 SITE_URL 기준의 절대 주소로 담음", () => {
		expect(sitemap()).toEqual([
			{ url: "https://jipsee.example/" },
			{ url: "https://jipsee.example/policies/data-sources" },
		]);
	});

	it("SITE_URL 끝에 슬래시가 있어도 슬래시가 겹치지 않음", () => {
		vi.stubEnv("SITE_URL", "https://jipsee.example/");

		expect(sitemap().map((entry) => entry.url)).toEqual([
			"https://jipsee.example/",
			"https://jipsee.example/policies/data-sources",
		]);
	});

	it("수정일, 갱신 주기, 우선순위는 담지 않음", () => {
		for (const entry of sitemap()) {
			expect(Object.keys(entry)).toEqual(["url"]);
		}
	});
});
