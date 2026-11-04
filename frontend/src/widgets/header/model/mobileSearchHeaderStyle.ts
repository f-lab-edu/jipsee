import type { BoxProps, HStackProps, IconProps } from "@seed-design/react";

export interface MobileSearchHeaderStyle {
	row: HStackProps;
	backLink: BoxProps;
	backIcon: Omit<IconProps, "svg">;
	formCell: BoxProps;
}
