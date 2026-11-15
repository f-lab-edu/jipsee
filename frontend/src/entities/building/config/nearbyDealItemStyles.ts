import type {
	BoxProps,
	HStackProps,
	TextProps,
	VStackProps,
} from "@seed-design/react";
import { typography } from "@/shared/config/typography";

export interface NearbyDealItemStyle {
	item: HStackProps;
	body: VStackProps;
	name: TextProps;
	meta: HStackProps;
	metaText: TextProps;
	amountBox: BoxProps;
	amount: TextProps;
}

export const nearbyDealItemStyles: NearbyDealItemStyle = {
	item: {
		alignItems: "center",
		justifyContent: "space-between",
		gap: "x3",
		py: "x3_5",
		borderBottomWidth: 1,
		borderColor: "stroke.neutralMuted",
	},
	body: { gap: "x1", minWidth: "0px" },
	name: {
		...typography.size15,
		fontWeight: "bold",
		color: "fg.neutral",
		maxLines: 1,
	},
	meta: { gap: "x2" },
	metaText: { ...typography.size13, color: "fg.neutralMuted" },
	amountBox: {
		display: "flex",
		justifyContent: "flex-end",
		flexShrink: 0,
		maxWidth: "55%",
	},
	amount: {
		...typography.size15,
		fontWeight: "bold",
		align: "right",
		color: "fg.neutral",
	},
};
