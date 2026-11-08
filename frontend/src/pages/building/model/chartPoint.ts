import type { ChartDeal } from "@/pages/building/model/chartDeal";

export type ChartPoint = {
	dealId: number;
	fromPreviousBuilding: boolean;
	dealType: ChartDeal["dealType"];
	xPercent: number;
	yPercent: number;
};
