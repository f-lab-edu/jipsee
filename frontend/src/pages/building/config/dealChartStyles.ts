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
	},
	xTick: { position: "absolute", display: "flex" },
};

export const dealChartStyles = defineResponsiveStyles<DealChartStyle>({
	mobile: {
		...shared,
		container: { columns: "72px minmax(0, 1fr)", gap: "x2_5" },
		yLabels: {
			flexDirection: "column",
			justifyContent: "space-between",
			height: "160px",
			mt: "-7px",
		},
		yLabel: { ...shared.yLabel, ...typography.size11 },
		graph: { display: "flex" },
		svg: { width: "100%", height: "160px", overflow: "visible" },
		markerDiameter: 12,
		xLabels: { position: "relative", height: "18px", mt: "6px" },
		xLabel: {
			...typography.size11,
			color: "fg.neutralMuted",
		},
	},
	desktop: {
		...shared,
		container: { columns: "84px minmax(0, 1fr)", gap: "x2_5" },
		yLabels: {
			flexDirection: "column",
			justifyContent: "space-between",
			height: "220px",
			mt: "-7px",
		},
		yLabel: { ...shared.yLabel, ...typography.size12LineHeight14 },
		graph: { display: "flex" },
		svg: { width: "100%", height: "220px", overflow: "visible" },
		markerDiameter: 14,
		xLabels: { position: "relative", height: "18px", mt: "6px" },
		xLabel: {
			...typography.size12LineHeight14,
			color: "fg.neutralMuted",
		},
	},
});
