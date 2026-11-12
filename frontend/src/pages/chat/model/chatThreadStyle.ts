import type {
	BoxProps,
	HStackProps,
	IconProps,
	TextProps,
	VStackProps,
} from "@seed-design/react";

export interface ChatThreadStyle {
	thread: VStackProps;
	empty: VStackProps;
	emptyHeading: VStackProps;
	emptyIcon: BoxProps;
	emptyIconSvg: Omit<IconProps, "svg">;
	emptyTitle: TextProps;
	examples: VStackProps;
	example: BoxProps;
	exampleText: TextProps;
	error: VStackProps;
	errorRow: HStackProps;
	errorIcon: Omit<IconProps, "svg">;
	errorText: TextProps;
	retryButton: BoxProps;
	retryText: TextProps;
}
