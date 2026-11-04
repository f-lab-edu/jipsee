import type { BuildingTableStyle } from "@/pages/search/model/buildingTableStyle";
import { typography } from "@/shared/config/typography";

export const buildingTableStyles: BuildingTableStyle = {
	panel: {
		bg: "bg.layerDefault",
		borderWidth: 1,
		borderColor: "stroke.neutralMuted",
		borderRadius: "r5",
		py: "x2",
	},
	headerRow: {
		alignItems: "center",
		borderBottomWidth: 1,
		borderColor: "stroke.neutralWeak",
	},
	buildingHeaderCell: { display: "flex", px: "x8", py: "x3" },
	headerCell: { display: "flex", px: "x4", py: "x3" },
	detailHeaderCell: { display: "flex", pr: "x6", py: "x3" },
	headerText: {
		...typography.size13LineHeight20,
		fontWeight: "medium",
		color: "fg.neutralMuted",
	},
};
