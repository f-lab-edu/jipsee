import type { BuildingDealItemStyle } from "@/entities/building/model/buildingDealItemStyle";
import { typography } from "@/shared/config/typography";

export const buildingDealItemStyles: BuildingDealItemStyle = {
	item: {
		alignItems: "center",
		justifyContent: "space-between",
		gap: "x3",
		py: "x3_5",
		borderBottomWidth: 1,
		borderColor: "stroke.neutralMuted",
	},
	body: { gap: "x1_5" },
	meta: { gap: "x2" },
	metaText: { ...typography.size13, color: "fg.neutralMuted" },
	amountBox: {
		display: "flex",
		justifyContent: "flex-end",
		flexShrink: 0,
		maxWidth: "55%",
	},
	amount: {
		...typography.size16,
		fontWeight: "bold",
		align: "right",
		color: "fg.neutral",
	},
	cancelledAmount: {
		textDecorationLine: "line-through",
		color: "fg.neutralSubtle",
	},
};
