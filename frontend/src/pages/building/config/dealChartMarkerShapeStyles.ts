import type { DealChartMarkerShapeStyle } from "@/pages/building/model/dealChartMarkerShapeStyle";

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
	layerFill,
	similarMiddleRingOffset: 2,
	similarOuterRingOffset: 4,
	previousRingOffset: 3,
	previousRing: {
		fill: "none",
		stroke: "currentColor",
		strokeWidth: 2,
		strokeDasharray: "0.1 0.9",
		pathLength: 16,
		strokeLinecap: "round",
	},
};
