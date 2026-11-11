import type { NearbyDealContractChipStyle } from "@/entities/building/model/nearbyDealContractChipStyle";
import { typography } from "@/shared/config/typography";
import { defineResponsiveStyles } from "@/shared/lib/defineResponsiveStyles";

export const nearbyDealContractChipStyles =
	defineResponsiveStyles<NearbyDealContractChipStyle>({
		mobile: {
			chip: {
				display: "flex",
				px: "6px",
				py: "2px",
				borderRadius: "r1",
				bg: "bg.neutralWeak",
			},
			label: {
				...typography.size11,
				fontWeight: "medium",
				color: "fg.neutralMuted",
			},
		},
		desktop: {
			chip: {
				display: "flex",
				px: "x2",
				py: "x1",
				borderRadius: "r1_5",
				bg: "bg.neutralWeak",
			},
			label: {
				...typography.size12LineHeight16,
				fontWeight: "medium",
				color: "fg.neutralMuted",
			},
		},
	});
