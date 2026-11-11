import { Text } from "@seed-design/react";
import { policyContentStyles } from "@/pages/policy/config/policyStyles";
import type { PolicyBlock } from "@/pages/policy/model/policyDocument";
import PolicyList from "@/pages/policy/ui/PolicyList";
import PolicyRows from "@/pages/policy/ui/PolicyRows";
import PolicyTable from "@/pages/policy/ui/PolicyTable";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";

interface PolicyClauseBlockProps {
	layout: ResponsiveVariant;
	block: PolicyBlock;
}

/**
 * 정책 > 조항 본문 블록
 *
 * - 문단, 목록, 라벨과 값 줄 묶음, 표 중 블록 종류에 맞는 것을 출력
 */
export default function PolicyClauseBlock({
	layout,
	block,
}: PolicyClauseBlockProps) {
	if (block.kind === "list") {
		return <PolicyList layout={layout} items={block.items} />;
	}

	if (block.kind === "rows") {
		return (
			<PolicyRows layout={layout} heading={block.heading} rows={block.rows} />
		);
	}

	if (block.kind === "table") {
		return (
			<PolicyTable
				layout={layout}
				headingLabel={block.headingLabel}
				groups={block.groups}
			/>
		);
	}

	return (
		<Text as="p" {...policyContentStyles[layout].paragraph}>
			{block.text}
		</Text>
	);
}
