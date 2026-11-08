import type { BoxProps } from "@seed-design/react";
import type { NearbyDealsFilterStyle } from "@/features/filterNearbyDeals/model/nearbyDealsFilterStyle";
import { typography } from "@/shared/config/typography";
import { defineResponsiveStyles } from "@/shared/lib/defineResponsiveStyles";

const chip: BoxProps = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	height: "36px",
	minWidth: "24px",
	px: "x3",
	borderRadius: "full",
};

const shared: Omit<NearbyDealsFilterStyle, "container" | "labelCell"> = {
	group: { display: "flex", alignItems: "center", gap: "x2" },
	groupLabel: { ...typography.size13, color: "fg.neutralMuted" },
	chips: { display: "flex", gap: "x1_5" },
	chipLabel: { ...typography.size14 },
	selected: {
		chip: { ...chip, bg: "bg.neutralSolid" },
		label: { fontWeight: "bold", color: "fg.onNeutralSolid" },
	},
	unselected: {
		chip: { ...chip, bg: "bg.neutralWeak" },
		label: { fontWeight: "medium", color: "fg.neutral" },
	},
};

export const nearbyDealsFilterStyles =
	defineResponsiveStyles<NearbyDealsFilterStyle>({
		mobile: {
			...shared,
			container: { display: "flex", flexDirection: "column", gap: "x2_5" },
			labelCell: { display: "flex", width: "36px", flexShrink: 0 },
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
			labelCell: { display: "flex" },
		},
	});
