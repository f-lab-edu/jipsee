import type {
	BoxProps,
	FlexProps,
	GridProps,
	IconProps,
	TextProps,
	VStackProps,
} from "@seed-design/react";

type IconStyle = Omit<IconProps, "svg">;

export interface SearchGuideLayoutStyle {
	root: VStackProps;
	panel: VStackProps;
	title: TextProps;
	items: GridProps;
	item: FlexProps;
	iconCell: BoxProps;
	checkIcon: IconStyle;
	slashIcon: IconStyle;
	clockIcon: IconStyle;
	text: TextProps;
	highlight: TextProps;
}
