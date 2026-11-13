import type { BuildingDeal } from "@/entities/building/model/buildingDeal";

export type ChartDeal = {
	deal: BuildingDeal;
	dealType: "jeonse" | "sale";
	fromPreviousBuilding: boolean;
};
