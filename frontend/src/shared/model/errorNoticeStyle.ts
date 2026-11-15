import type {
	BoxProps,
	HStackProps,
	IconProps,
	TextProps,
} from "@seed-design/react";

export interface ErrorNoticeStyle {
	box: HStackProps;
	iconCell: BoxProps;
	icon: Omit<IconProps, "svg">;
	text: TextProps;
}
