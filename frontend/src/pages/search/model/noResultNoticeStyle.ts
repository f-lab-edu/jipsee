import type { BoxProps, IconProps, TextProps } from "@seed-design/react";

export interface NoResultNoticeStyle {
	root: BoxProps;
	circle: BoxProps;
	icon: Omit<IconProps, "svg">;
	textBlock: BoxProps;
	title: TextProps;
	description: TextProps;
}
