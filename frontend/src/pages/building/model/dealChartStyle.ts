import type {
	BoxProps,
	FlexProps,
	GridProps,
	TextProps,
} from "@seed-design/react";
import type { CSSProperties, SVGProps } from "react";

export interface DealChartStyle {
	container: GridProps;
	yLabels: FlexProps;
	yLabel: TextProps;
	graph: BoxProps;
	svg: SVGProps<SVGSVGElement>;
	topGridLine: SVGProps<SVGLineElement>;
	middleGridLine: SVGProps<SVGLineElement>;
	axisLine: SVGProps<SVGLineElement>;
	markerDiameter: number;
	markerColors: {
		jeonse: CSSProperties;
		sale: CSSProperties;
		previous: CSSProperties;
	};
	xLabels: BoxProps;
	xTick: BoxProps;
	xLabel: TextProps;
}
