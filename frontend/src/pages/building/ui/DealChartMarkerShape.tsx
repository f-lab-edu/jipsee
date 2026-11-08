import { dealChartMarkerShapeStyles } from "@/pages/building/config/dealChartMarkerShapeStyles";
import type { ChartDeal } from "@/pages/building/model/chartDeal";
import type { ChartMarkerKind } from "@/pages/building/model/chartMarkerKind";

interface DealChartMarkerShapeProps {
	dealType: ChartDeal["dealType"];
	markerKind: ChartMarkerKind;
	diameter: number;
}

/**
 * 건물 상세 > 거래 그래프 마커 모양
 *
 * - 원점을 중심으로 모양만 그리고 위치와 색은 갖지 않음
 * - 색은 `currentColor`를 따름
 * - 기본은 전세는 원, 매매는 45도 돌린 둥근 네모
 * - 갱신은 안쪽을 비운 굵은 테두리, 해제는 안쪽을 비운 점선 테두리
 * - 유사 건물은 사이를 비운 두 겹 고리가 있는 원
 * - 이전 건물은 바깥에 점 모양 고리가 있는 원
 *
 * @param diameter 테두리를 포함한 마커 지름
 */
export default function DealChartMarkerShape({
	dealType,
	markerKind,
	diameter,
}: DealChartMarkerShapeProps) {
	const style = dealChartMarkerShapeStyles;
	const radius = diameter / 2;

	if (markerKind === "similar") {
		return (
			<g>
				<circle
					cx="0"
					cy="0"
					r={radius + style.similarOuterRingOffset}
					fill="currentColor"
				/>
				<circle
					cx="0"
					cy="0"
					r={radius + style.similarMiddleRingOffset}
					fill={style.layerFill}
				/>
				<circle cx="0" cy="0" r={radius} fill="currentColor" />
			</g>
		);
	}

	if (markerKind === "previous") {
		return (
			<g>
				<circle cx="0" cy="0" r={radius} fill="currentColor" />
				<circle
					cx="0"
					cy="0"
					r={radius + style.previousRingOffset}
					{...style.previousRing}
				/>
			</g>
		);
	}

	const outlined = style.outlined[markerKind];
	const inset = outlined.strokeWidth / 2;

	if (dealType === "sale") {
		const side = diameter - outlined.strokeWidth;

		return (
			<rect
				x={-side / 2}
				y={-side / 2}
				width={side}
				height={side}
				rx={style.cornerRadius}
				transform="rotate(45)"
				strokeDashoffset={style.dashOffsets.sale}
				{...outlined}
			/>
		);
	}

	return (
		<circle
			cx="0"
			cy="0"
			r={radius - inset}
			strokeDashoffset={style.dashOffsets.jeonse}
			{...outlined}
		/>
	);
}
