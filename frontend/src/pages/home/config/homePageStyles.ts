import type { BoxProps } from "@seed-design/react";

export interface HomePageStyle {
	introWrapper: BoxProps;
	guideCell: BoxProps;
}

export const homePageStyles: HomePageStyle = {
	introWrapper: {
		display: { base: "block", lg: "flex" },
		flexDirection: "column",
		flexGrow: 1,
		gap: { base: 0, lg: "x5" },
	},
	guideCell: { pt: { base: "x5", lg: 0 } },
};
