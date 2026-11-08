import type {
	BoxProps,
	HStackProps,
	IconProps,
	TextProps,
} from "@seed-design/react";

export interface BuildingTitleRowStyle {
	row: HStackProps;
	backButton: BoxProps;
	backIcon: Omit<IconProps, "svg">;
	titleGroup: HStackProps;
	title: TextProps;
	addressCell: BoxProps;
	address: TextProps;
}
