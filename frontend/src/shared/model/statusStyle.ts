import type {
	BoxProps,
	IconProps,
	TextProps,
	VStackProps,
} from "@seed-design/react";

export interface StatusStyle {
	body: VStackProps;
	card: VStackProps;
	root: VStackProps;
	circle: BoxProps;
	icon: Omit<IconProps, "svg">;
	textBlock: VStackProps;
	title: TextProps;
	description: TextProps;
	actions: VStackProps;
	primaryButton: BoxProps;
	primaryText: TextProps;
	secondaryButton: BoxProps;
	secondaryText: TextProps;
}
