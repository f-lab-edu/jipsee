import type {
	BoxProps,
	FlexProps,
	TextProps,
	VStackProps,
} from "@seed-design/react";

export interface IntroLayoutStyle {
	background: BoxProps;
	titleRow?: FlexProps;
	titleBlock: VStackProps;
	illustrationCell?: FlexProps;
	title: TextProps;
	description: TextProps;
	chips: FlexProps;
	chip: BoxProps;
	chipLabel: TextProps;
}
