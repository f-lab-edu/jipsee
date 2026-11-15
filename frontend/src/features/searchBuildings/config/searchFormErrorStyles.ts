import type {
	BoxProps,
	HStackProps,
	IconProps,
	TextProps,
} from "@seed-design/react";
import { typography } from "@/shared/config/typography";

export interface SearchFormErrorStyle {
	line: HStackProps;
	icon: Omit<IconProps, "svg">;
	mobileCell: BoxProps;
	mobileText: TextProps;
	desktopCell: BoxProps;
	desktopText: TextProps;
}

export const searchFormErrorStyles: SearchFormErrorStyle = {
	line: { gap: "x1_5", alignItems: "center" },
	icon: { size: "x4", color: "palette.red800" },
	mobileCell: { display: "flex", hideFrom: "lg" },
	mobileText: {
		...typography.size13,
		fontWeight: "medium",
		color: "palette.red800",
	},
	desktopCell: { display: { base: "none", lg: "flex" } },
	desktopText: {
		...typography.size14,
		fontWeight: "medium",
		color: "palette.red800",
	},
};
