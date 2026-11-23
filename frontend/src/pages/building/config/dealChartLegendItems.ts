import { dealChartCopy } from "@/pages/building/config/dealChartCopy";
import type { DealChartLegendItem } from "@/pages/building/model/dealChartLegendItem";

export const dealChartLegendItems: DealChartLegendItem[] = [
	{
		label: dealChartCopy.jeonse,
		dealType: "jeonse",
		markerKind: "default",
		colorKey: "jeonse",
	},
	{
		label: dealChartCopy.sale,
		dealType: "sale",
		markerKind: "default",
		colorKey: "sale",
	},
	{
		label: dealChartCopy.renewal,
		dealType: "jeonse",
		markerKind: "renewal",
		colorKey: "neutralMuted",
	},
	{
		label: dealChartCopy.cancelled,
		dealType: "jeonse",
		markerKind: "cancelled",
		colorKey: "neutralMuted",
	},
];
