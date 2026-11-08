import type { ChartDeal } from "@/pages/building/model/chartDeal";

interface DealChartMarkerShapeProps {
	dealType: ChartDeal["dealType"];
	diameter: number;
}

/**
 * 건물 상세 > 거래 그래프 마커 모양
 *
 * - 원점을 중심으로 모양만 그리고 위치와 색은 갖지 않음
 * - 전세는 원, 매매는 45도 돌린 둥근 네모로 출력
 * - 색은 `currentColor`를 따름
 */
export default function DealChartMarkerShape({
	dealType,
	diameter,
}: DealChartMarkerShapeProps) {
	if (dealType === "sale") {
		return (
			<rect
				x={-diameter / 2}
				y={-diameter / 2}
				width={diameter}
				height={diameter}
				rx="2"
				transform="rotate(45)"
				fill="currentColor"
			/>
		);
	}

	return <circle cx="0" cy="0" r={diameter / 2} fill="currentColor" />;
}
