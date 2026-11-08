import { Box, Text } from "@seed-design/react";
import { dealChartCopy } from "@/pages/building/config/dealChartCopy";
import { dealChartStyles } from "@/pages/building/config/dealChartStyles";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";

interface DealChartPreviousBandProps {
	layout: ResponsiveVariant;
	widthPercent: number;
}

/**
 * 건물 상세 > 거래 그래프 이전 건물 영역
 *
 * - 그래프 왼쪽에서 지정한 폭만큼 회색 영역 출력
 * - 오른쪽 가장자리에 점선과 안쪽에 이전 건물 글자 출력
 *
 * @param widthPercent 그래프 폭 대비 영역 폭
 */
export default function DealChartPreviousBand({
	layout,
	widthPercent,
}: DealChartPreviousBandProps) {
	const style = dealChartStyles[layout];

	return (
		<Box width={`${widthPercent}%`} {...style.previousBand}>
			<svg aria-hidden="true" {...style.previousBandSvg}>
				<rect {...style.previousBandFill} />
				<line {...style.previousBandEdge} />
			</svg>
			<Box {...style.previousBandLabelBox}>
				<Text {...style.previousBandLabel}>{dealChartCopy.previousBand}</Text>
			</Box>
		</Box>
	);
}
