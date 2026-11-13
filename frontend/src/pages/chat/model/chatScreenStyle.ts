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
}

export interface ChatScreenStyle {
	main: VStackProps;
	card: HStackProps;
	hiddenOnDesktopCard: HStackProps;
	pane: VStackProps;
	toolbar: ChatToolbarStyle;
	chip: HStackProps;
	chipWrapper: VStackProps;
	chipColumn: VStackProps;
	chipIcon: Omit<IconProps, "svg">;
	chipText: TextProps;
}
