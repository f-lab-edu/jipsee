import type { BoxProps, TextProps } from "@seed-design/react";
import { typography } from "@/shared/config/typography";

export interface MobileBuildingTitleStyle {
	box: BoxProps;
	title: TextProps;
}

export const mobileBuildingTitleStyles: MobileBuildingTitleStyle = {
	box: { bg: "bg.layerDefault", pt: "x5", px: "spacingX.globalGutter" },
	title: {
		...typography.size18LineHeight24,
		fontWeight: "bold",
		color: "fg.neutral",
		maxLines: 1,
	},
};
