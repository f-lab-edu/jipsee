import type { BoxProps, IconProps, TextProps } from "@seed-design/react";

export interface HomeBackLinkStyle {
	link: BoxProps;
	icon: Omit<IconProps, "svg">;
	label: TextProps;
}
