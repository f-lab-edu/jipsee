import { Box, Text } from "@seed-design/react";
import { policyContentStyles } from "@/pages/policy/config/policyStyles";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";

interface PolicyTableHeadProps {
	layout: ResponsiveVariant;
	labels: readonly string[];
}

/** 정책 > 표 머리글 줄 */
export default function PolicyTableHead({
	layout,
	labels,
}: PolicyTableHeadProps) {
	const style = policyContentStyles[layout];

	return (
		<thead>
			<Box as="tr" {...style.tableHeadRow}>
				{labels.map((label) => (
					<Box asChild key={label} {...style.tableHeadCell}>
						<th scope="col">
							<Text {...style.tableHeadText}>{label}</Text>
						</th>
					</Box>
				))}
			</Box>
		</thead>
	);
}
