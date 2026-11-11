import type {
	BoxProps,
	HStackProps,
	IconProps,
	TextProps,
	VStackProps,
} from "@seed-design/react";

export interface LoginStyle {
	main: VStackProps;
	mobileBody: VStackProps;
	desktopBody: VStackProps;
	card: VStackProps;
	actions: VStackProps;
	providers: VStackProps;
	errorNotice: {
		box: HStackProps;
		iconCell: BoxProps;
		icon: Omit<IconProps, "svg">;
		text: TextProps;
	};
	notice: {
		group: VStackProps;
		consent: TextProps;
		link: TextProps;
	};
	intro: VStackProps;
	logoSize: number;
	title: TextProps;
	description: TextProps;
}
