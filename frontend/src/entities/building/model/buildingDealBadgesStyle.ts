import type { BoxProps, HStackProps, TextProps } from "@seed-design/react";
import type { BuildingDeal } from "@/entities/building/model/buildingDeal";

export interface BuildingDealBadgesStyle {
	container: HStackProps;
	typeLabel: TextProps;
	statusLabel: TextProps;
	byType: Record<BuildingDeal["type"], { badge: BoxProps; label: TextProps }>;
	cancelled: { badge: BoxProps; label: TextProps };
	similarBuilding: { badge: BoxProps; label: TextProps };
}
