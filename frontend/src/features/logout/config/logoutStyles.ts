import type { BoxProps, TextProps } from "@seed-design/react";
import { typography } from "@/shared/config/typography";

export interface LogoutStyle {
	button: BoxProps;
	text: TextProps;
}

export const logoutStyles: LogoutStyle = {
	button: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		width: "full",
		height: "48px",
		borderRadius: "r3",
		bg: "bg.neutralWeak",
	},
	text: { ...typography.size15, fontWeight: "bold", color: "fg.neutral" },
};
