import type { BoxProps, IconProps, TextProps } from "@seed-design/react";

export interface LocationMissingNoticeStyle {
	notice: BoxProps;
	iconCell: BoxProps;
	icon: Omit<IconProps, "svg">;
	text: TextProps;
}
