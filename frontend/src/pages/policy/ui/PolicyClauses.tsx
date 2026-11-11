import { Text, VStack } from "@seed-design/react";
import { policyContentStyles } from "@/pages/policy/config/policyStyles";
import type { PolicyDocument } from "@/pages/policy/model/policyDocument";
import PolicyClause from "@/pages/policy/ui/PolicyClause";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";

interface PolicyClausesProps {
	layout: ResponsiveVariant;
	policyDocument: PolicyDocument;
}

/**
 * 정책 > 조항 목록
 *
 * - 조항을 순서대로 출력
 * - 부칙이 있으면 조항 아래에 출력
 */
export default function PolicyClauses({
	layout,
	policyDocument,
}: PolicyClausesProps) {
	const style = policyContentStyles;

	return (
		<VStack data-area={`policy-clauses-${layout}`} {...style.clauses}>
			{policyDocument.clauses.map((clause, index) => (
				<PolicyClause
					key={clause.title}
					layout={layout}
					order={index + 1}
					clause={clause}
				/>
			))}
			{policyDocument.addendum !== undefined && (
				<Text as="p" {...style.addendum}>
					{policyDocument.addendum}
				</Text>
			)}
		</VStack>
	);
}
