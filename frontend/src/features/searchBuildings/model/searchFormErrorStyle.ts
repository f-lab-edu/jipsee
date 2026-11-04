import type {
	BoxProps,
	HStackProps,
	IconProps,
	TextProps,
} from "@seed-design/react";

export interface SearchFormErrorStyle {
	line: HStackProps;
	icon: Omit<IconProps, "svg">;
	mobileCell: BoxProps;
	mobileText: TextProps;
	desktopCell: BoxProps;
	desktopText: TextProps;
}
