import type { BoxProps, TextProps } from "@seed-design/react";
import { typography } from "@/shared/config/typography";
import { defineResponsiveStyles } from "@/shared/lib/defineResponsiveStyles";

export interface NearbyDealsFilterStyle {
	container: BoxProps;
	group: BoxProps;
	labelCell: BoxProps;
	groupLabel: TextProps;
	select: BoxProps;
}

const shared: Omit<NearbyDealsFilterStyle, "container"> = {
	group: { display: "flex", alignItems: "center", gap: "x2" },
	labelCell: { display: "flex" },
	groupLabel: { ...typography.size13, color: "fg.neutralMuted" },
	select: { display: "flex", flexShrink: 0 },
};

export const nearbyDealsFilterStyles =
	defineResponsiveStyles<NearbyDealsFilterStyle>({
		mobile: {
			...shared,
			container: {
				display: "flex",
				flexWrap: "wrap",
				alignItems: "center",
				gap: "10px 16px",
			},
		},
		desktop: {
			...shared,
			container: {
				display: "flex",
				flexWrap: "wrap",
				alignItems: "center",
				gap: "12px 28px",
				px: "x5",
				py: "x4",
				borderRadius: "r3_5",
				bg: "bg.layerBasement",
			},
		},
	});
