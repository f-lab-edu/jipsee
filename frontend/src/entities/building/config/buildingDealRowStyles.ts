import type { BoxProps, GridProps, TextProps } from "@seed-design/react";
import { typography } from "@/shared/config/typography";

export interface BuildingDealRowStyle {
	row: GridProps;
	cell: BoxProps;
	amountCell: BoxProps;
	date: TextProps;
	area: TextProps;
	amount: TextProps;
	cancelledAmount: TextProps;
}

export const buildingDealRowStyles: BuildingDealRowStyle = {
	row: {
		alignItems: "center",
		gap: "x4",
		py: "x3_5",
		borderBottomWidth: 1,
		borderColor: "stroke.neutralMuted",
	},
	cell: { display: "flex" },
	amountCell: { display: "flex", justifyContent: "flex-end" },
	date: { ...typography.size15, color: "fg.neutral" },
	area: { ...typography.size15, color: "fg.neutralMuted" },
	amount: { ...typography.size15, fontWeight: "bold", color: "fg.neutral" },
	cancelledAmount: {
		textDecorationLine: "line-through",
		color: "fg.neutralSubtle",
	},
};
