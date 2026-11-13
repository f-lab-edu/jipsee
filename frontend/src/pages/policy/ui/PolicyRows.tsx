import { Box, Text, VStack } from "@seed-design/react";
import { policyContentStyles } from "@/pages/policy/config/policyStyles";
import type { PolicyRow } from "@/pages/policy/model/policyDocument";
import PolicyRowItem from "@/pages/policy/ui/PolicyRowItem";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";

interface PolicyRowsProps {
	layout: ResponsiveVariant;
	heading?: string;
	rows: readonly PolicyRow[];
}

/**
 * 정책 > 라벨과 값 줄 묶음
 *
 * - 라벨과 값 줄을 테두리 있는 정의 목록 카드로 출력
 * - 첫 줄을 뺀 줄은 위쪽 구분선 출력
 * - heading이 있으면 카드 위에 소제목 출력
 */
export default function PolicyRows({ layout, heading, rows }: PolicyRowsProps) {
	const style = policyContentStyles[layout];

	return (
		<VStack {...style.rowsGroup}>
			{heading !== undefined && (
				<Text as="h3" {...style.rowsHeading}>
					{heading}
				</Text>
			)}
			<Box as="dl" {...style.rowsCard}>
				{rows.slice(0, 1).map(({ label, value }) => (
					<PolicyRowItem
						key={label}
						layout={layout}
						rowStyle={style.row}
						label={label}
						value={value}
					/>
				))}
				{rows.slice(1).map(({ label, value }) => (
					<PolicyRowItem
						key={label}
						layout={layout}
						rowStyle={style.dividedRow}
						label={label}
						value={value}
					/>
				))}
			</Box>
		</VStack>
	);
}
