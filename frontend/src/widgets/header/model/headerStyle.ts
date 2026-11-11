import type { BoxProps, HStackProps, TextProps } from "@seed-design/react";

export interface HeaderStyle {
	container?: BoxProps;
	row: HStackProps;
	leftGroup?: HStackProps;
	brandLink: HStackProps;
	logoSize: number;
	serviceName: TextProps;
}
