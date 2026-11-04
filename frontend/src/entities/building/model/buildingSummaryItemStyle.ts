import type {
	BoxProps,
	FlexProps,
	IconProps,
	TextProps,
	VStackProps,
} from "@seed-design/react";

export interface BuildingSummaryItemStyle {
	row: FlexProps;
	body: VStackProps;
	name: TextProps;
	detailCell: BoxProps;
	detail: TextProps;
	chevronCell: BoxProps;
	chevron: Omit<IconProps, "svg">;
}
