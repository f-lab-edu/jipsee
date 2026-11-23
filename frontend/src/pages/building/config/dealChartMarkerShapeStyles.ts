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
}

const layerFill = "var(--seed-color-bg-layer-default)";

export const dealChartMarkerShapeStyles: DealChartMarkerShapeStyle = {
	cornerRadius: 2,
	outlined: {
		default: { fill: "currentColor", strokeWidth: 0 },
		renewal: { fill: layerFill, stroke: "currentColor", strokeWidth: 3 },
		cancelled: {
			fill: layerFill,
			stroke: "currentColor",
			strokeWidth: 2,
			strokeDasharray: "0.9 0.1",
			pathLength: 4,
		},
	},
	dashOffsets: { jeonse: -0.55, sale: -0.05 },
};
