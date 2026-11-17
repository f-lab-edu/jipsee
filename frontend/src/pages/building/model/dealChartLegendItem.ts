import type { DealChartStyle } from "@/pages/building/config/dealChartStyles";
import type { ChartDeal } from "@/pages/building/model/chartDeal";
import type { ChartMarkerKind } from "@/pages/building/model/chartMarkerKind";

export type DealChartLegendItem = {
	label: string;
	dealType: ChartDeal["dealType"];
	markerKind: ChartMarkerKind;
	colorKey: keyof DealChartStyle["markerColors"];
};
