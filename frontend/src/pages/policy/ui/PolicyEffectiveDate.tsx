import { Box, Text } from "@seed-design/react";
import { policyCopy } from "@/pages/policy/config/policyCopy";
import { policyContentStyles } from "@/pages/policy/config/policyStyles";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";

interface PolicyEffectiveDateProps {
	layout: ResponsiveVariant;
	effectiveDate: string;
}

/**
 * 정책 > 시행일 줄
 *
 * - 첫 버전이라 이전 버전 링크 없이 날짜만 출력
 */
export default function PolicyEffectiveDate({
	layout,
	effectiveDate,
}: PolicyEffectiveDateProps) {
	const style = policyContentStyles[layout];

	return (
		<Box {...style.effectiveDateBox}>
			<Text
				as="p"
				data-area={`policy-effective-date-${layout}`}
				{...style.effectiveDate}
			>
				{`${policyCopy.effectiveDateLabel} ${effectiveDate}`}
			</Text>
		</Box>
	);
}
