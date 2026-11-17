import type { BoxProps, GridProps, TextProps } from "@seed-design/react";
import { typography } from "@/shared/config/typography";

export interface NearbyDealListStyle {
	list: BoxProps;
	headerRow: GridProps;
	headerCell: BoxProps;
	amountHeaderCell: BoxProps;
	headerText: TextProps;
}

export const nearbyDealListStyles: NearbyDealListStyle = {
	list: { m: 0, p: 0 },
	headerRow: {
		gap: "x4",
		py: "x2_5",
		borderBottomWidth: 1,
		borderColor: "stroke.neutralWeak",
	},
	headerCell: { display: "flex" },
	amountHeaderCell: { display: "flex", justifyContent: "flex-end" },
	headerText: { ...typography.size13, color: "fg.neutralMuted" },
};
