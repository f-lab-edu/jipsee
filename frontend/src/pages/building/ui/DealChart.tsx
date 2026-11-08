import { Box, Flex, Grid, Text, VStack } from "@seed-design/react";
import { formatAmount } from "@/entities/building/lib/formatAmount";
import type { BuildingDeal } from "@/entities/building/model/buildingDeal";
import { dealChartStyles } from "@/pages/building/config/dealChartStyles";
import { toChartAxis } from "@/pages/building/lib/toChartAxis";
import { toChartDeals } from "@/pages/building/lib/toChartDeals";
import { toChartLabel } from "@/pages/building/lib/toChartLabel";
import { toChartPoints } from "@/pages/building/lib/toChartPoints";
import DealChartMarker from "@/pages/building/ui/DealChartMarker";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";

interface DealChartProps {
	layout: ResponsiveVariant;
	deals: BuildingDeal[];
	previousDeals: BuildingDeal[];
	endYear: number;
}

/**
 * 건물 상세 > 거래 이력 점 그래프
 *
 * - 현재 건물과 이전 건물의 전세, 매매 거래를 금액과 계약 월 위치에 점으로 출력
 * - 점을 그릴 거래가 없으면 출력하지 않음
 * - 왼쪽에 금액 세 개, 아래에 연도 눈금 출력
 *
 * @param endYear 가로축 끝 연도. 실거래 기준 월의 연도
 */
export default function DealChart({
	layout,
	deals,
	previousDeals,
	endYear,
}: DealChartProps) {
	const style = dealChartStyles[layout];
	const chartDeals = toChartDeals(deals, previousDeals);
	const axis = toChartAxis(chartDeals, endYear);

	if (axis === null) {
		return null;
	}

	const points = toChartPoints(chartDeals, axis);

	return (
		<Grid {...style.container}>
			<Flex {...style.yLabels}>
				{axis.yLabels.map((amount) => (
					<Text key={amount} {...style.yLabel}>
						{formatAmount(amount)}
					</Text>
				))}
			</Flex>
			<VStack>
				<Box
					role="img"
					aria-label={toChartLabel(points, deals.length > 0)}
					{...style.graph}
				>
					<svg aria-hidden="true" {...style.svg}>
						<line {...style.topGridLine} />
						<line {...style.middleGridLine} />
						<line {...style.axisLine} />
						{points.map((point) => (
							<DealChartMarker
								key={`${point.dealType}-${point.dealId}`}
								point={point}
								layout={layout}
							/>
						))}
					</svg>
				</Box>
				<Box {...style.xLabels}>
					{axis.xTicks.map((tick) => (
						<Box key={tick.year} left={`${tick.xPercent}%`} {...style.xTick}>
							<Text {...style.xLabel}>{tick.year}</Text>
						</Box>
					))}
				</Box>
			</VStack>
		</Grid>
	);
}
