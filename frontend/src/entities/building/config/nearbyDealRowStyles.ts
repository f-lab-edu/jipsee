import type { NearbyDealRowStyle } from "@/entities/building/model/nearbyDealRowStyle";
import { typography } from "@/shared/config/typography";

export const nearbyDealRowStyles: NearbyDealRowStyle = {
	row: {
		alignItems: "center",
		gap: "x4",
		py: "x3_5",
		borderBottomWidth: 1,
		borderColor: "stroke.neutralMuted",
	},
	cell: { display: "flex", minWidth: "0px" },
	amountCell: { display: "flex", justifyContent: "flex-end" },
	name: {
		...typography.size15,
		fontWeight: "bold",
		color: "fg.neutral",
		maxLines: 1,
	},
	date: { ...typography.size15, color: "fg.neutral" },
	area: { ...typography.size15, color: "fg.neutralMuted" },
	amount: { ...typography.size15, fontWeight: "bold", color: "fg.neutral" },
};
