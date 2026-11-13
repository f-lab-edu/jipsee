import type { NearbyDealItemStyle } from "@/entities/building/model/nearbyDealItemStyle";
import { typography } from "@/shared/config/typography";

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
