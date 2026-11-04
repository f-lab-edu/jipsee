import type {
	BoxProps,
	FlexProps,
	TextProps,
	VStackProps,
} from "@seed-design/react";

export interface SearchPanelStyle {
	root: BoxProps;
	background: BoxProps;
	content: VStackProps;
	titleRow: FlexProps;
	titleBlock: VStackProps;
	title: TextProps;
	description: TextProps;
	desktopNoticeCell: BoxProps;
	formCell: BoxProps;
	mobileNoticeCell: BoxProps;
}
