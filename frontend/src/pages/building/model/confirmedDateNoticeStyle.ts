import type { BoxProps, IconProps, TextProps } from "@seed-design/react";

export interface ConfirmedDateNoticeStyle {
	notice: BoxProps;
	iconCell: BoxProps;
	icon: Omit<IconProps, "svg">;
	text: TextProps;
}
