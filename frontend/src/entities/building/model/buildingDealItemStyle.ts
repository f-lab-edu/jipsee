import type {
	BoxProps,
	HStackProps,
	TextProps,
	VStackProps,
} from "@seed-design/react";

export interface BuildingDealItemStyle {
	item: HStackProps;
	body: VStackProps;
	meta: HStackProps;
	metaText: TextProps;
	amountBox: BoxProps;
	amount: TextProps;
	cancelledAmount: TextProps;
}
