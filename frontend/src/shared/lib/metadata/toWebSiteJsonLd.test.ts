import { describe, expect, it } from "vitest";
import { toWebSiteJsonLd } from "@/shared/lib/metadata/toWebSiteJsonLd";

describe("toWebSiteJsonLd", () => {
	it("사이트 이름, 설명, 홈 주소와 검색 동작을 schema.org WebSite 모양으로 반환함", () => {
		expect(toWebSiteJsonLd("https://jipsee.example")).toEqual({
			"@context": "https://schema.org",
			"@type": "WebSite",
			name: "집씨",
			url: "https://jipsee.example/",
			description: "연립, 다세대 전월세 실거래를 공공데이터 그대로 보여줘요",
			inLanguage: "ko",
			potentialAction: {
				"@type": "SearchAction",
				target: {
					"@type": "EntryPoint",
					urlTemplate:
						"https://jipsee.example/search?keyword={search_term_string}",
				},
				"query-input": "required name=search_term_string",
			},
		});
	});

	it("검색어 자리의 중괄호는 인코딩하지 않음", () => {
		const { potentialAction } = toWebSiteJsonLd("https://jipsee.example");

		expect(potentialAction.target.urlTemplate).not.toContain("%7B");
	});

	it("siteUrl 끝에 슬래시가 있어도 슬래시가 겹치지 않음", () => {
		const jsonLd = toWebSiteJsonLd("https://jipsee.example/");

		expect(jsonLd.url).toBe("https://jipsee.example/");
		expect(jsonLd.potentialAction.target.urlTemplate).toBe(
			"https://jipsee.example/search?keyword={search_term_string}",
		);
	});
});
