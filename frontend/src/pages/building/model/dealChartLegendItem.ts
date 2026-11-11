import type { ChartDeal } from "@/pages/building/model/chartDeal";
import type { ChartMarkerKind } from "@/pages/building/model/chartMarkerKind";
import type { DealChartStyle } from "@/pages/building/model/dealChartStyle";

export type DealChartLegendItem = {
	label: string;
	dealType: ChartDeal["dealType"];
	markerKind: ChartMarkerKind;
	colorKey: keyof DealChartStyle["markerColors"];
};
