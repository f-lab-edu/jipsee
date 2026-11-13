import { Box, Grid, Text } from "@seed-design/react";
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
 * - 번호는 스크린 리더가 읽지 않음
 * - 데스크톱은 두 열로 위에서 아래 순서로 채움
 */
export default function PolicyToc({ layout, clauses }: PolicyTocProps) {
	const style = policyContentStyles[layout];
	const rowCount = Math.ceil(clauses.length / 2);

	return (
		<Box
			as="nav"
			aria-label={policyCopy.tocLabel}
			data-area={`policy-toc-${layout}`}
			{...style.toc}
		>
			<Grid as="ol" {...style.tocList} rows={rowCount}>
				{clauses.map(({ title }, index) => (
					<li key={title}>
						<Box asChild {...style.tocLink}>
							<a href={`#${toClauseId(layout, index + 1)}`}>
								<Box as="span" aria-hidden="true" {...style.tocNumberCell}>
									<Text {...style.tocNumber}>{`${index + 1}.`}</Text>
								</Box>
								<Text {...style.tocTitle}>{title}</Text>
							</a>
						</Box>
					</li>
				))}
			</Grid>
		</Box>
	);
}
