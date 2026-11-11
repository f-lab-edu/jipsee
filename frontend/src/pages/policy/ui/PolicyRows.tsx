import { Box, HStack, Text, VStack } from "@seed-design/react";
import { policyContentStyles } from "@/pages/policy/config/policyStyles";
import type { PolicyRow } from "@/pages/policy/model/policyDocument";

interface PolicyRowsProps {
	heading?: string;
	rows: readonly PolicyRow[];
}

/**
 * 정책 > 라벨과 값 줄 묶음
 *
 * - heading이 있으면 묶음 위에 소제목 출력
 */
export default function PolicyRows({ heading, rows }: PolicyRowsProps) {
	const style = policyContentStyles;

	return (
		<VStack {...style.rowsGroup}>
			{heading !== undefined && (
				<Text as="h3" {...style.rowsHeading}>
					{heading}
				</Text>
			)}
			{rows.map(({ label, value }) => (
				<HStack key={label} {...style.row}>
					<Box {...style.rowLabelCell}>
						<Text {...style.rowLabel}>{label}</Text>
					</Box>
					<Box {...style.rowValueCell}>
						<Text {...style.rowValue}>{value}</Text>
					</Box>
				</HStack>
			))}
		</VStack>
	);
}
