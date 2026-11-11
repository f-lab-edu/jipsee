import type {
	BoxProps,
	FlexProps,
	GridProps,
	HStackProps,
	TextProps,
	VStackProps,
} from "@seed-design/react";
import type { CSSProperties, SVGProps } from "react";

export interface DealChartStyle {
	root: VStackProps;
	legend: FlexProps;
	legendItem: HStackProps;
	legendLabel: TextProps;
	legendNote: TextProps;
	legendMarkerDiameter: number;
	container: GridProps;
	yLabels: FlexProps;
	yLabel: TextProps;
	graph: BoxProps;
	svg: SVGProps<SVGSVGElement>;
	topGridLine: SVGProps<SVGLineElement>;
	middleGridLine: SVGProps<SVGLineElement>;
	axisLine: SVGProps<SVGLineElement>;
	markerDiameter: number;
	markerSvg: SVGProps<SVGSVGElement>;
	markerColors: {
		jeonse: CSSProperties;
		sale: CSSProperties;
		previous: CSSProperties;
		neutralMuted: CSSProperties;
	};
	previousBand: BoxProps;
	previousBandSvg: SVGProps<SVGSVGElement>;
	previousBandFill: SVGProps<SVGRectElement>;
	previousBandEdge: SVGProps<SVGLineElement>;
	previousBandLabelBox: BoxProps;
	previousBandLabel: TextProps;
	emptyPillOverlay: FlexProps;
	emptyPill: BoxProps;
	emptyPillLabel: TextProps;
	xLabels: BoxProps;
	xTick: BoxProps;
	xLabel: TextProps;
}
