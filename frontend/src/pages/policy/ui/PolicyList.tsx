import { Box, Text, VStack } from "@seed-design/react";
import { policyContentStyles } from "@/pages/policy/config/policyStyles";

interface PolicyListProps {
	items: readonly string[];
}

/** 정책 > 본문 목록 */
export default function PolicyList({ items }: PolicyListProps) {
	const style = policyContentStyles;

	return (
		<VStack as="ul" {...style.list}>
			{items.map((item) => (
				<Box as="li" key={item}>
					<Text {...style.listItem}>{item}</Text>
				</Box>
			))}
		</VStack>
	);
}
