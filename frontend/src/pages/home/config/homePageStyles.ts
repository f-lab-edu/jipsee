import type { HomePageStyle } from "@/pages/home/model/homePageStyle";

export const homePageStyles: HomePageStyle = {
	searchGutter: { px: "spacingX.globalGutter" },
	introWrapper: {
		display: { base: "block", lg: "flex" },
		flexDirection: "column",
		flexGrow: 1,
		gap: { base: 0, lg: "x5" },
	},
};
