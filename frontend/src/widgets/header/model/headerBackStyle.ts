import type { BoxProps, IconProps } from "@seed-design/react";

export interface HeaderBackStyle {
	box: BoxProps;
	icon: Omit<IconProps, "svg">;
}
