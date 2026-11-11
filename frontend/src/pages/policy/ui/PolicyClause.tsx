import { Text, VStack } from "@seed-design/react";
import { policyContentStyles } from "@/pages/policy/config/policyStyles";
import { toBlockKey } from "@/pages/policy/lib/toBlockKey";
import { toClauseId } from "@/pages/policy/lib/toClauseId";
import type { PolicyClause as PolicyClauseData } from "@/pages/policy/model/policyDocument";
import PolicyClauseBlock from "@/pages/policy/ui/PolicyClauseBlock";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";

interface PolicyClauseProps {
	layout: ResponsiveVariant;
	order: number;
	clause: PolicyClauseData;
}

/**
 * 정책 > 조항
 *
 * - 번호 붙은 제목과 본문 블록 출력
 * - 목차 앵커가 가리키는 id를 조항에 붙임
 *
 * @param order 1부터 시작하는 조항 순번. 제목 번호와 id에 씀
 */
export default function PolicyClause({
	layout,
	order,
	clause,
}: PolicyClauseProps) {
	const style = policyContentStyles;
	const id = toClauseId(layout, order);
	const titleId = `${id}-title`;

	return (
		<VStack
			as="section"
			id={id}
			aria-labelledby={titleId}
			data-area={`policy-clause-${layout}-${order}`}
			{...style.clause}
		>
			<Text as="h2" id={titleId} {...style.clauseTitle}>
				{`${order}. ${clause.title}`}
			</Text>
			{clause.blocks.map((block) => (
				<PolicyClauseBlock key={toBlockKey(block)} block={block} />
			))}
		</VStack>
	);
}
