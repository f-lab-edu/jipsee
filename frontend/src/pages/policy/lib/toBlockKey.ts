import type { PolicyBlock } from "@/pages/policy/model/policyDocument";

/**
 * 정책 > 본문 블록 key 생성
 *
 * - 블록 순서가 바뀌지 않는 정적 문서라 블록 내용에서 key를 만듦
 */
export function toBlockKey(block: PolicyBlock): string {
	if (block.kind === "paragraph") {
		return block.text;
	}

	if (block.kind === "list") {
		return block.items.join("|");
	}

	if (block.kind === "table") {
		return block.groups.map((group) => group.heading).join("|");
	}

	return `${block.heading ?? ""}|${block.rows.map((row) => row.label).join("|")}`;
}
