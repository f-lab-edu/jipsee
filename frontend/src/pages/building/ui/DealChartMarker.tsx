import { dealChartStyles } from "@/pages/building/config/dealChartStyles";
import type { ChartPoint } from "@/pages/building/model/chartPoint";
import type { DealChartStyle } from "@/pages/building/model/dealChartStyle";
import DealChartMarkerShape from "@/pages/building/ui/DealChartMarkerShape";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";

interface DealChartMarkerProps {
	point: ChartPoint;
	layout: ResponsiveVariant;
}

/**
 * 건물 상세 > 거래 그래프 마커
 *
 * - 점의 가로, 세로 비율 위치에 마커 출력
 * - 이전 건물 거래는 회색, 매매는 경고색, 그 밖은 브랜드색
 * - 마커 종류에 따라 모양 출력
 */
export default function DealChartMarker({
	point,
	layout,
}: DealChartMarkerProps) {
	const style = dealChartStyles[layout];
	let colorKey: keyof DealChartStyle["markerColors"] = point.dealType;

	if (point.fromPreviousBuilding) {
		colorKey = "previous";
	}

	return (
		<svg
			aria-hidden="true"
			{...style.markerSvg}
			x={`${point.xPercent}%`}
			y={`${point.yPercent}%`}
			style={style.markerColors[colorKey]}
		>
			<DealChartMarkerShape
				dealType={point.dealType}
				markerKind={point.markerKind}
				diameter={style.markerDiameter}
			/>
		</svg>
	);
}
