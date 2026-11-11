import type { MobileBuildingTitleStyle } from "@/pages/building/model/mobileBuildingTitleStyle";
import { typography } from "@/shared/config/typography";

export const mobileBuildingTitleStyles: MobileBuildingTitleStyle = {
	box: { bg: "bg.layerDefault", pt: "x5", px: "spacingX.globalGutter" },
	title: {
		...typography.size18LineHeight24,
		fontWeight: "bold",
		color: "fg.neutral",
		maxLines: 1,
	},
};
