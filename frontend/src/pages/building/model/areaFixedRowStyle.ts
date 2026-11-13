import type { BoxProps, IconProps, TextProps } from "@seed-design/react";

export interface AreaFixedRowStyle {
	row: BoxProps;
	labelCell: BoxProps;
	label: TextProps;
	content: BoxProps;
	icon: Omit<IconProps, "svg">;
	text: TextProps;
}
