import type {
	BoxProps,
	FlexProps,
	IconProps,
	TextProps,
} from "@seed-design/react";

export interface BaseMonthNoticeStyle {
	root: FlexProps;
	iconCell?: BoxProps;
	icon?: Omit<IconProps, "svg">;
	text: TextProps;
	highlight: TextProps;
}
