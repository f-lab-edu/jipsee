import type { BoxProps, TextProps } from "@seed-design/react";
import { typography } from "@/shared/config/typography";

export interface AccountLinkStyle {
	box: BoxProps;
	text: TextProps;
}

export const accountLinkStyles: AccountLinkStyle = {
	box: {
		display: "flex",
		alignItems: "center",
		height: "38px",
		px: "x4",
		borderRadius: "r2_5",
		bg: "bg.layerDefault",
		borderWidth: 1,
		borderColor: "stroke.neutralWeak",
	},
	text: { ...typography.size14, fontWeight: "bold", color: "fg.neutral" },
};
