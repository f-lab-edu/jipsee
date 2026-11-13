import type {
	BoxProps,
	HStackProps,
	TextProps,
	VStackProps,
} from "@seed-design/react";

export interface NearbyDealItemStyle {
	item: HStackProps;
	body: VStackProps;
	name: TextProps;
	meta: HStackProps;
	metaText: TextProps;
	amountBox: BoxProps;
	amount: TextProps;
}
