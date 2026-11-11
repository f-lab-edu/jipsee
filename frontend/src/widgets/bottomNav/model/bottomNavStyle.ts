import type {
	BoxProps,
	HStackProps,
	IconProps,
	TextProps,
} from "@seed-design/react";

export interface BottomNavTabStateStyle {
	icon: Omit<IconProps, "svg">;
	label: TextProps;
	strokeWidth: number;
}

export interface BottomNavStyle {
	root: BoxProps;
	list: HStackProps;
	item: BoxProps;
	link: BoxProps;
	active: BottomNavTabStateStyle;
	inactive: BottomNavTabStateStyle;
}
