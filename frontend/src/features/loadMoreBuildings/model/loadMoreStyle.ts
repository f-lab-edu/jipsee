import type {
	BoxProps,
	FlexProps,
	IconProps,
	TextProps,
} from "@seed-design/react";

export interface LoadMoreStyle {
	area: FlexProps;
	button: BoxProps;
	buttonText: TextProps;
	buttonIcon: Omit<IconProps, "svg">;
	loadingIconBox: BoxProps;
	loadingIcon: Omit<IconProps, "svg">;
	error: FlexProps;
	errorRow: FlexProps;
	errorIcon: Omit<IconProps, "svg">;
	errorText: TextProps;
	retryButton: BoxProps;
	retryText: TextProps;
}
