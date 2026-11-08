import type {
	BoxProps,
	HStackProps,
	IconProps,
	TextProps,
} from "@seed-design/react";

export interface MobileBackHeaderStyle {
	row: HStackProps;
	backButton: BoxProps;
	backIcon: Omit<IconProps, "svg">;
	title: TextProps;
}
