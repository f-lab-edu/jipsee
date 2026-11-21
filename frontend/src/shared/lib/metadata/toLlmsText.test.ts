import { describe, expect, it } from "vitest";
import { toLlmsText } from "@/shared/lib/metadata/toLlmsText";

describe("toLlmsText", () => {
	it("이름, 설명, 홈과 데이터 출처의 절대 주소 링크를 llmstxt.org 형식으로 반환함", () => {
		expect(toLlmsText("https://jipsee.example")).toBe(
			[
				"# 집씨",
				"",
				"> 연립, 다세대 전월세 실거래와 건축물대장을 공공데이터 그대로 보여줘요",
				"",
				"## 페이지",
				"",
				"- [집씨](https://jipsee.example/)",
				"- [데이터 출처](https://jipsee.example/policies/data-sources)",
				"",
			].join("\n"),
		);
	});

	it("검색, 건물 상세 주소는 담지 않음", () => {
		const text = toLlmsText("https://jipsee.example");

		expect(text).not.toContain("/search");
		expect(text).not.toContain("/buildings");
	});

	it("siteUrl 끝에 슬래시가 있어도 슬래시가 겹치지 않음", () => {
		expect(toLlmsText("https://jipsee.example/")).toContain(
			"- [집씨](https://jipsee.example/)\n- [데이터 출처](https://jipsee.example/policies/data-sources)",
		);
	});
});
