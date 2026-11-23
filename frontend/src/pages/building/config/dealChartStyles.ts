import type {
	BoxProps,
	FlexProps,
	GridProps,
	HStackProps,
	TextProps,
	VStackProps,
} from "@seed-design/react";
import type { CSSProperties, SVGProps } from "react";
import { typography } from "@/shared/config/typography";
import { defineResponsiveStyles } from "@/shared/lib/defineResponsiveStyles";

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
		neutralMuted: CSSProperties;
	};
	xLabels: BoxProps;
	xTick: BoxProps;
	xLabel: TextProps;
}

const shared: Pick<
	DealChartStyle,
	| "yLabel"
	| "topGridLine"
	| "middleGridLine"
	| "axisLine"
	| "markerColors"
	| "markerSvg"
	| "legend"
	| "legendItem"
	| "legendLabel"
	| "legendNote"
	| "xTick"
> = {
	yLabel: { align: "right", color: "fg.neutralMuted" },
	topGridLine: {
		x1: "0",
		x2: "100%",
		y1: "0",
		y2: "0",
		stroke: "var(--seed-color-stroke-neutral-weak)",
		strokeDasharray: "3 3",
	},
	middleGridLine: {
		x1: "0",
		x2: "100%",
		y1: "50%",
		y2: "50%",
		stroke: "var(--seed-color-stroke-neutral-weak)",
		strokeDasharray: "3 3",
	},
	axisLine: {
		x1: "0",
		x2: "100%",
		y1: "100%",
		y2: "100%",
		stroke: "var(--seed-color-stroke-neutral-weak)",
	},
	markerColors: {
		jeonse: { color: "var(--seed-color-bg-brand-solid)" },
		sale: { color: "var(--seed-color-fg-warning)" },
		neutralMuted: { color: "var(--seed-color-fg-neutral-muted)" },
	},
	markerSvg: { overflow: "visible" },
	legend: { wrap: "wrap", alignItems: "center", gap: "8px 14px" },
	legendItem: { alignItems: "center", gap: "x1_5" },
	legendLabel: { ...typography.size13, color: "fg.neutralMuted" },
	legendNote: { ...typography.size12, color: "fg.neutralMuted" },
	xTick: { position: "absolute", display: "flex" },
};

export const dealChartStyles = defineResponsiveStyles<DealChartStyle>({
	mobile: {
		...shared,
		root: { gap: "x3" },
		legendMarkerDiameter: 10,
		container: { columns: "72px minmax(0, 1fr)", gap: "x2_5" },
		yLabels: {
			flexDirection: "column",
			justifyContent: "space-between",
			height: "160px",
			mt: "-7px",
		},
		yLabel: { ...shared.yLabel, ...typography.size11 },
		graph: { display: "flex", position: "relative" },
		svg: {
			width: "100%",
			height: "160px",
			overflow: "visible",
			style: { position: "relative" },
		},
		markerDiameter: 12,
		xLabels: { position: "relative", height: "18px", mt: "6px" },
		xLabel: {
			...typography.size11,
			color: "fg.neutralMuted",
		},
	},
	desktop: {
		...shared,
		root: { gap: "x3_5" },
		legendMarkerDiameter: 12,
		container: { columns: "84px minmax(0, 1fr)", gap: "x2_5" },
		yLabels: {
			flexDirection: "column",
			justifyContent: "space-between",
			height: "220px",
			mt: "-7px",
		},
		yLabel: { ...shared.yLabel, ...typography.size12LineHeight14 },
		graph: { display: "flex", position: "relative" },
		svg: {
			width: "100%",
			height: "220px",
			overflow: "visible",
			style: { position: "relative" },
		},
		markerDiameter: 14,
		xLabels: { position: "relative", height: "18px", mt: "6px" },
		xLabel: {
			...typography.size12LineHeight14,
			color: "fg.neutralMuted",
		},
	},
});
