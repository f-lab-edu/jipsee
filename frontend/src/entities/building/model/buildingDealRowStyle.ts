import type { BoxProps, GridProps, TextProps } from "@seed-design/react";

export interface BuildingDealRowStyle {
	row: GridProps;
	cell: BoxProps;
	amountCell: BoxProps;
	date: TextProps;
	area: TextProps;
	amount: TextProps;
	cancelledAmount: TextProps;
}
