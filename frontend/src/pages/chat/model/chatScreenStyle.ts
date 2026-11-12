import type {
	BoxProps,
	HStackProps,
	IconProps,
	TextProps,
	VStackProps,
} from "@seed-design/react";

export interface ChatToolbarStyle {
	root: HStackProps;
	titleGroup: HStackProps;
	title: TextProps;
	actions: HStackProps;
	button: BoxProps;
	buttonText: TextProps;
	backButton: BoxProps;
	backIcon: Omit<IconProps, "svg">;
}

export interface ChatScreenStyle {
	main: VStackProps;
	card: VStackProps;
	toolbar: Record<"mobile" | "desktop", ChatToolbarStyle>;
	chip: HStackProps;
	chipWrapper: VStackProps;
	chipIcon: Omit<IconProps, "svg">;
	chipText: TextProps;
}
