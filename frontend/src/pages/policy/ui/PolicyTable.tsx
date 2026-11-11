import { Box, VStack } from "@seed-design/react";
import { policyContentStyles } from "@/pages/policy/config/policyStyles";
import type { PolicyRowGroup } from "@/pages/policy/model/policyDocument";
import PolicyRows from "@/pages/policy/ui/PolicyRows";
import PolicyTableHead from "@/pages/policy/ui/PolicyTableHead";
import PolicyTableRow from "@/pages/policy/ui/PolicyTableRow";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";

interface PolicyTableProps {
	layout: ResponsiveVariant;
	headingLabel: string;
	groups: readonly PolicyRowGroup[];
}

/**
 * 정책 > 수탁자별 표
 *
 * - 데스크톱은 수탁자를 행으로, 라벨을 열 머리글로 둔 표 출력
 * - 모바일은 수탁자마다 소제목과 라벨 값 카드 출력
 */
export default function PolicyTable({
	layout,
	headingLabel,
	groups,
}: PolicyTableProps) {
	const style = policyContentStyles[layout];
	const columnLabels = [
		headingLabel,
		...groups[0].rows.map(({ label }) => label),
	];

	if (layout === "mobile") {
		return (
			<VStack {...style.tableCards}>
				{groups.map(({ heading, rows }) => (
					<PolicyRows
						key={heading}
						layout={layout}
						heading={heading}
						rows={rows}
					/>
				))}
			</VStack>
		);
	}

	return (
		<Box {...style.tableWrapper}>
			<Box as="table" {...style.table}>
				<PolicyTableHead layout={layout} labels={columnLabels} />
				<tbody>
					{groups.map((group) => (
						<PolicyTableRow key={group.heading} layout={layout} group={group} />
					))}
				</tbody>
			</Box>
		</Box>
	);
}
