import type { DealChartStyle } from "@/pages/building/model/dealChartStyle";
import { typography } from "@/shared/config/typography";
import { defineResponsiveStyles } from "@/shared/lib/defineResponsiveStyles";

const shared: Pick<
	DealChartStyle,
	| "yLabel"
	| "topGridLine"
	| "middleGridLine"
	| "axisLine"
	| "markerColors"
	| "markerSvg"
	| "previousBand"
	| "previousBandSvg"
	| "previousBandFill"
	| "previousBandEdge"
	| "previousBandLabelBox"
	| "emptyPillOverlay"
	| "emptyPill"
	| "emptyPillLabel"
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
		previous: { color: "var(--seed-color-fg-neutral-subtle)" },
		neutralMuted: { color: "var(--seed-color-fg-neutral-muted)" },
	},
	markerSvg: { overflow: "visible" },
	legend: { wrap: "wrap", alignItems: "center", gap: "8px 14px" },
	legendItem: { alignItems: "center", gap: "x1_5" },
	legendLabel: { ...typography.size13, color: "fg.neutralMuted" },
	legendNote: { ...typography.size12, color: "fg.neutralMuted" },
	previousBand: {
		position: "absolute",
		top: "0px",
		bottom: "0px",
		left: "0px",
	},
	previousBandSvg: { width: "100%", height: "100%", overflow: "visible" },
	previousBandFill: {
		x: "0",
		y: "0",
		width: "100%",
		height: "100%",
		fill: "var(--seed-color-bg-neutral-weak)",
	},
	previousBandEdge: {
		x1: "100%",
		x2: "100%",
		y1: "0",
		y2: "100%",
		stroke: "var(--seed-color-stroke-neutral-weak)",
		strokeDasharray: "3 3",
	},
	previousBandLabelBox: {
		display: "flex",
		position: "absolute",
		top: "6px",
		left: "6px",
	},
	emptyPillOverlay: {
		position: "absolute",
		top: "0px",
		bottom: "0px",
		left: "0px",
		right: "0px",
		alignItems: "center",
		justifyContent: "center",
	},
	emptyPill: {
		px: "x3_5",
		py: "x2",
		bg: "bg.layerDefault",
		borderRadius: "full",
		borderWidth: 1,
		borderColor: "stroke.neutralWeak",
	},
	emptyPillLabel: {
		...typography.size14,
		fontWeight: "bold",
		color: "fg.neutral",
	},
	xTick: { position: "absolute", display: "flex" },
};

export const dealChartStyles = defineResponsiveStyles<DealChartStyle>({
	mobile: {
		...shared,
		root: { gap: "x3" },
		legendMarkerDiameter: 10,
		previousBandLabel: {
			...typography.size11,
			color: "fg.neutralMuted",
			whiteSpace: "nowrap",
		},
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
		previousBandLabel: {
			...typography.size11,
			color: "fg.neutralMuted",
			whiteSpace: "nowrap",
		},
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
