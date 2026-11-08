import type { BoxProps, TextProps } from "@seed-design/react";

interface NearbyDealsFilterChipStateStyle {
	chip: BoxProps;
	label: TextProps;
}

export interface NearbyDealsFilterStyle {
	container: BoxProps;
	group: BoxProps;
	labelCell: BoxProps;
	groupLabel: TextProps;
	chips: BoxProps;
	chipLabel: TextProps;
	selected: NearbyDealsFilterChipStateStyle;
	unselected: NearbyDealsFilterChipStateStyle;
}
