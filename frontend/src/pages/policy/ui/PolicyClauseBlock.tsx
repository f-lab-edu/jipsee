import { Text } from "@seed-design/react";
import { policyContentStyles } from "@/pages/policy/config/policyStyles";
import type { PolicyBlock } from "@/pages/policy/model/policyDocument";
import PolicyList from "@/pages/policy/ui/PolicyList";
import PolicyRows from "@/pages/policy/ui/PolicyRows";

interface PolicyClauseBlockProps {
	block: PolicyBlock;
}

/**
 * 정책 > 조항 본문 블록
 *
 * - 문단, 목록, 라벨과 값 줄 묶음 중 블록 종류에 맞는 것을 출력
 */
export default function PolicyClauseBlock({ block }: PolicyClauseBlockProps) {
	if (block.kind === "list") {
		return <PolicyList items={block.items} />;
	}

	if (block.kind === "rows") {
		return <PolicyRows heading={block.heading} rows={block.rows} />;
	}

	return (
		<Text as="p" {...policyContentStyles.paragraph}>
			{block.text}
		</Text>
	);
}
