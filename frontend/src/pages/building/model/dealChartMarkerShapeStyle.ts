import type { SVGProps } from "react";

type OutlinedShapeStyle = {
	fill: string;
	stroke?: string;
	strokeWidth: number;
	strokeDasharray?: string;
	pathLength?: number;
};

export interface DealChartMarkerShapeStyle {
	cornerRadius: number;
	outlined: {
		default: OutlinedShapeStyle;
		renewal: OutlinedShapeStyle;
		cancelled: OutlinedShapeStyle;
	};
	dashOffsets: { jeonse: number; sale: number };
	layerFill: string;
	similarMiddleRingOffset: number;
	similarOuterRingOffset: number;
	previousRingOffset: number;
	previousRing: SVGProps<SVGCircleElement>;
}
