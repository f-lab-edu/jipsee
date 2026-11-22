import type { GridItemProps, GridProps, VStackProps } from "@seed-design/react";

export interface HomeScreenStyle {
	main: VStackProps;
	grid: GridProps;
	bodyCell: GridItemProps;
	body: VStackProps;
}

export const homeScreenStyles: HomeScreenStyle = {
	main: { flexGrow: 1 },
	grid: {
		flexGrow: 1,
		columns: 1,
		gap: { base: 0, lg: "x6" },
		pt: { base: 0, lg: "x8" },
		pb: { base: 0, lg: "x6" },
	},
	bodyCell: { display: "flex", flexDirection: "column" },
	body: { flexGrow: 1, gap: { base: 0, lg: "x5" } },
};
