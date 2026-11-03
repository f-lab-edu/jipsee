import type { BoxProps, HStackProps, TextProps } from "@seed-design/react";

export interface HeaderStyle {
	container?: BoxProps;
	row: HStackProps;
	brandLink: HStackProps;
	logoSize: number;
	serviceName: TextProps;
}
