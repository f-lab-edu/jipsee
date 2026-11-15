import type { VStackProps } from "@seed-design/react";

export interface BuildingStatusStyle {
	body: VStackProps;
}

export const buildingStatusStyles: BuildingStatusStyle = {
	body: {
		flexGrow: 1,
		pt: { base: 0, lg: "x8" },
		pb: { base: 0, lg: "x6" },
	},
};
