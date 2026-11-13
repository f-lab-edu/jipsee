import { Flex, HStack, Text } from "@seed-design/react";
import { dealChartCopy } from "@/pages/building/config/dealChartCopy";
import { dealChartLegendItems } from "@/pages/building/config/dealChartLegendItems";
import { dealChartStyles } from "@/pages/building/config/dealChartStyles";
import DealChartMarkerShape from "@/pages/building/ui/DealChartMarkerShape";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";

interface DealChartLegendProps {
	layout: ResponsiveVariant;
}

/**
 * 건물 상세 > 거래 그래프 범례
 *
 * - 마커 종류마다 작은 마커와 이름 출력
 * - 마지막에 월세는 목록에서 확인하라는 보조 문구 출력
 */
export default function DealChartLegend({ layout }: DealChartLegendProps) {
	const style = dealChartStyles[layout];
	const diameter = style.legendMarkerDiameter;

	return (
		<Flex data-area={`deal-chart-legend-${layout}`} {...style.legend}>
			{dealChartLegendItems.map((item) => (
				<HStack key={item.label} {...style.legendItem}>
					<svg
						aria-hidden="true"
						{...style.markerSvg}
						width={diameter}
						height={diameter}
						viewBox={`${-diameter / 2} ${-diameter / 2} ${diameter} ${diameter}`}
						style={style.markerColors[item.colorKey]}
					>
						<DealChartMarkerShape
							dealType={item.dealType}
							markerKind={item.markerKind}
							diameter={diameter}
						/>
					</svg>
					<Text {...style.legendLabel}>{item.label}</Text>
				</HStack>
			))}
			<Text {...style.legendNote}>{dealChartCopy.legendNote}</Text>
		</Flex>
	);
}
