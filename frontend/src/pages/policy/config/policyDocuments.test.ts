import { describe, expect, it } from "vitest";
import { privacyDocument } from "@/pages/policy/config/privacyDocument";
import { termsDocument } from "@/pages/policy/config/termsDocument";
import type { PolicyBlock } from "@/pages/policy/model/policyDocument";

// 와이어프레임 처리방침 목차 10개와 기획서 이용약관 항목명 7개
const PRIVACY_TOC = [
	"처리 목적",
	"처리 항목",
	"보유 기간, 파기",
	"처리 위탁",
	"국외 이전",
	"쿠키",
	"정보주체 권리",
	"안전성 확보 조치",
	"보호책임자",
	"변경",
];
const TERMS_TOC = [
	"서비스 내용",
	"회원",
	"이용 제한",
	"데이터 한계",
	"챗봇",
	"책임",
	"변경, 분쟁",
];

function findBlocks<Kind extends PolicyBlock["kind"]>(
	blocks: readonly PolicyBlock[],
	kind: Kind,
) {
	return blocks.filter(
		(block): block is Extract<PolicyBlock, { kind: Kind }> =>
			block.kind === kind,
	);
}

describe("정책 문서 데이터", () => {
	it("두 문서의 시행일이 2026.11.17임", () => {
		expect(termsDocument.effectiveDate).toBe("2026.11.17");
		expect(privacyDocument.effectiveDate).toBe("2026.11.17");
	});

	it("이용약관 조항 제목이 기획서 항목명 7개와 순서까지 같음", () => {
		expect(termsDocument.clauses.map((clause) => clause.title)).toEqual(
			TERMS_TOC,
		);
	});

	it("개인정보처리방침 조항 제목이 와이어프레임 목차 10개와 순서까지 같음", () => {
		expect(privacyDocument.clauses.map((clause) => clause.title)).toEqual(
			PRIVACY_TOC,
		);
	});

	it("모든 조항에 문단이 하나 이상 있음", () => {
		for (const { title, blocks } of [
			...termsDocument.clauses,
			...privacyDocument.clauses,
		]) {
			expect(findBlocks(blocks, "paragraph").length, title).toBeGreaterThan(0);
		}
	});

	it("처리 항목은 라벨과 값 네 줄임", () => {
		const [rows] = findBlocks(privacyDocument.clauses[1].blocks, "rows");

		expect(rows.rows).toHaveLength(4);
	});

	it("처리 위탁 표는 수탁자 네 곳과 위탁 업무, 위탁 항목, 보유 기간 줄로 이루어짐", () => {
		const [table] = findBlocks(privacyDocument.clauses[3].blocks, "table");

		expect(table.headingLabel).toBe("수탁자");
		expect(table.groups.map((group) => group.heading)).toEqual([
			"Oracle",
			"Anthropic, PBC",
			"Cloudflare, Inc. [2단계 확정 전]",
			"Functional Software, Inc.(Sentry) [2단계 확정 전]",
		]);
		for (const group of table.groups) {
			expect(group.rows.map((row) => row.label)).toEqual([
				"위탁 업무",
				"위탁 항목",
				"보유 기간",
			]);
		}
	});

	it("국외 이전은 이전받는 자 네 곳이 순서대로 나옴", () => {
		const headings = findBlocks(privacyDocument.clauses[4].blocks, "rows").map(
			(block) => block.heading,
		);

		expect(headings).toEqual([
			"Oracle",
			"Anthropic, PBC",
			"Cloudflare, Inc. [2단계 확정 전]",
			"Functional Software, Inc.(Sentry) [2단계 확정 전]",
		]);
	});
});
