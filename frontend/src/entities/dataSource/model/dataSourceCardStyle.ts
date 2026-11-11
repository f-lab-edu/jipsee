import type { HStackProps, TextProps, VStackProps } from "@seed-design/react";

export interface DataSourceCardStyle {
	card: VStackProps;
	name: TextProps;
	provider: TextProps;
	footer: HStackProps;
	updateLine: TextProps;
	originalLink: TextProps;
}
