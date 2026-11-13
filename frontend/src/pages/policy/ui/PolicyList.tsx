import { Box, Text, VStack } from "@seed-design/react";
import { policyContentStyles } from "@/pages/policy/config/policyStyles";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";

interface PolicyListProps {
	layout: ResponsiveVariant;
	items: readonly string[];
}

/** 정책 > 본문 목록 */
export default function PolicyList({ layout, items }: PolicyListProps) {
	const style = policyContentStyles[layout];

	return (
		<VStack as="ul" {...style.list}>
			{items.map((item) => (
				<li key={item}>
					<Box {...style.listItem}>
						<Text {...style.listItemText}>{item}</Text>
					</Box>
				</li>
			))}
		</VStack>
	);
}
