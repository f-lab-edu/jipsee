import { Grid, type GridProps, Text } from "@seed-design/react";
import { policyContentStyles } from "@/pages/policy/config/policyStyles";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";

interface PolicyRowItemProps {
	layout: ResponsiveVariant;
	rowStyle: GridProps;
	label: string;
	value: string;
}

/**
 * 정책 > 라벨과 값 한 줄
 *
 * - 모바일은 라벨 아래에 값, 데스크톱은 라벨 열 옆에 값 출력
 *
 * @param rowStyle 줄 모양. 첫 줄과 구분선이 있는 나머지 줄을 호출한 쪽이 나눠 넘김
 */
export default function PolicyRowItem({
	layout,
	rowStyle,
	label,
	value,
}: PolicyRowItemProps) {
	const style = policyContentStyles[layout];

	return (
		<Grid {...rowStyle}>
			<Text as="dt" {...style.rowLabel}>
				{label}
			</Text>
			<Text as="dd" {...style.rowValue}>
				{value}
			</Text>
		</Grid>
	);
}
