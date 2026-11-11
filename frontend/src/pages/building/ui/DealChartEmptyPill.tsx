import { Box, Flex, Text } from "@seed-design/react";
import { dealChartCopy } from "@/pages/building/config/dealChartCopy";
import { dealChartStyles } from "@/pages/building/config/dealChartStyles";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";

interface DealChartEmptyPillProps {
	layout: ResponsiveVariant;
}

/**
 * 건물 상세 > 거래 그래프 현재 건물 거래 없음 알약
 *
 * - 그래프 가운데에 현재 건물 거래가 없다는 문구 출력
 */
export default function DealChartEmptyPill({
	layout,
}: DealChartEmptyPillProps) {
	const style = dealChartStyles[layout];

	return (
		<Flex {...style.emptyPillOverlay}>
			<Box {...style.emptyPill}>
				<Text as="p" {...style.emptyPillLabel}>
					{dealChartCopy.emptyPill}
				</Text>
			</Box>
		</Flex>
	);
}
