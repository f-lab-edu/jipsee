import type {
	BoxProps,
	HStackProps,
	IconProps,
	TextProps,
} from "@seed-design/react";
import { typography } from "@/shared/config/typography";

export interface BuildingTitleRowStyle {
	row: HStackProps;
	backButton: BoxProps;
	backIcon: Omit<IconProps, "svg">;
	titleGroup: HStackProps;
	title: TextProps;
	addressCell: BoxProps;
	address: TextProps;
}

export const buildingTitleRowStyles: BuildingTitleRowStyle = {
	row: { gap: "x3", alignItems: "center" },
	backButton: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		flexShrink: 0,
		width: "44px",
		height: "44px",
		borderRadius: "full",
		bg: "bg.layerDefault",
	},
	backIcon: { size: "22px", color: "fg.neutral" },
	titleGroup: { gap: "x3", minWidth: "0px", className: "align-baseline" },
	title: {
		...typography.size28,
		fontWeight: "bold",
		color: "fg.neutral",
		maxLines: 1,
	},
	addressCell: { flexShrink: 0 },
	address: {
		...typography.size16LineHeight24,
		color: "fg.neutralMuted",
		whiteSpace: "nowrap",
	},
};
