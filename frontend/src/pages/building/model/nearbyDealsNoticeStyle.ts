import type { BoxProps, IconProps, TextProps } from "@seed-design/react";

export interface NearbyDealsNoticeStyle {
	notice: BoxProps;
	iconCell: BoxProps;
	icon: Omit<IconProps, "svg">;
	textGroup: BoxProps;
	title: TextProps;
	body: TextProps;
}
