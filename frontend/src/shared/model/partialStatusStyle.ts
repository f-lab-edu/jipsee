import type {
	BoxProps,
	IconProps,
	TextProps,
	VStackProps,
} from "@seed-design/react";

export interface PartialStatusStyle {
	panel: VStackProps;
	root: VStackProps;
	circle: BoxProps;
	icon: Omit<IconProps, "svg">;
	title: TextProps;
	retryButton: BoxProps;
	retryText: TextProps;
}
