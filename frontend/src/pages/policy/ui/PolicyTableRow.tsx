import { Box, Text } from "@seed-design/react";
import { policyContentStyles } from "@/pages/policy/config/policyStyles";
import type { PolicyRowGroup } from "@/pages/policy/model/policyDocument";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";

interface PolicyTableRowProps {
	layout: ResponsiveVariant;
	group: PolicyRowGroup;
}

/** 정책 > 표 본문 한 줄 */
export default function PolicyTableRow({ layout, group }: PolicyTableRowProps) {
	const style = policyContentStyles[layout];

	return (
		<Box as="tr" {...style.tableRow}>
			<Box asChild {...style.tableRowHeadCell}>
				<th scope="row">
					<Text {...style.tableRowHeadText}>{group.heading}</Text>
				</th>
			</Box>
			{group.rows.map(({ label, value }) => (
				<Box as="td" key={label} {...style.tableCell}>
					<Text {...style.tableCellText}>{value}</Text>
				</Box>
			))}
		</Box>
	);
}
