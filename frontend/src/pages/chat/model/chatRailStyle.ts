import type {
	BoxProps,
	HStackProps,
	IconProps,
	TextProps,
	VStackProps,
} from "@seed-design/react";

export interface ChatRailStyle {
	root: VStackProps;
	inner: VStackProps;
	toolbar: VStackProps;
	titleBox: BoxProps;
	title: TextProps;
	newChat: BoxProps;
	newChatCurrent: BoxProps;
	newChatIcon: Omit<IconProps, "svg">;
	newChatText: TextProps;
	newChatCurrentText: TextProps;
	headingBox: BoxProps;
	heading: TextProps;
	nav: VStackProps;
	list: VStackProps;
	item: HStackProps;
	itemCurrent: HStackProps;
	link: VStackProps;
	linkTitle: TextProps;
	linkTitleCurrent: TextProps;
	linkTime: TextProps;
	empty: VStackProps;
	emptyText: TextProps;
}
