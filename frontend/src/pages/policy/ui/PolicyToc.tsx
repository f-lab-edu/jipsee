import { Box, Text, VStack } from "@seed-design/react";
import { policyCopy } from "@/pages/policy/config/policyCopy";
import { policyContentStyles } from "@/pages/policy/config/policyStyles";
import { toClauseId } from "@/pages/policy/lib/toClauseId";
import type { PolicyClause } from "@/pages/policy/model/policyDocument";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";

interface PolicyTocProps {
	layout: ResponsiveVariant;
	clauses: readonly PolicyClause[];
}

/**
 * 정책 > 목차
 *
 * - 번호 붙은 조항 제목을 같은 문서 안 조항으로 가는 앵커 링크 목록으로 출력
 */
export default function PolicyToc({ layout, clauses }: PolicyTocProps) {
	const style = policyContentStyles;

	return (
		<VStack
			as="nav"
			aria-label={policyCopy.tocLabel}
			data-area={`policy-toc-${layout}`}
			{...style.toc}
		>
			<VStack as="ol" {...style.tocList}>
				{clauses.map(({ title }, index) => (
					<Box as="li" key={title}>
						<a href={`#${toClauseId(layout, index + 1)}`}>
							<Text {...style.tocLink}>{`${index + 1}. ${title}`}</Text>
						</a>
					</Box>
				))}
			</VStack>
		</VStack>
	);
}
