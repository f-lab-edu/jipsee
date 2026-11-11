import type { ChartDeal } from "@/pages/building/model/chartDeal";
import type { ChartMarkerKind } from "@/pages/building/model/chartMarkerKind";

export type ChartPoint = {
	dealId: number;
	fromPreviousBuilding: boolean;
	dealType: ChartDeal["dealType"];
	markerKind: ChartMarkerKind;
	xPercent: number;
	yPercent: number;
};
