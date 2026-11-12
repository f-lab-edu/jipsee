import type { HStackProps, TextProps, VStackProps } from "@seed-design/react";

export interface ChatHistoryStyle {
	list: VStackProps;
	item: HStackProps;
	link: VStackProps;
	title: TextProps;
	time: TextProps;
	empty: VStackProps;
	emptyText: TextProps;
	root: VStackProps;
}
