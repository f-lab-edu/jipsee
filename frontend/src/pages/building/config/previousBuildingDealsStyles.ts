import type { PreviousBuildingDealsStyle } from "@/pages/building/model/previousBuildingDealsStyle";
import { typography } from "@/shared/config/typography";
import { defineResponsiveStyles } from "@/shared/lib/defineResponsiveStyles";

export const previousBuildingDealsStyles =
	defineResponsiveStyles<PreviousBuildingDealsStyle>({
		mobile: {
			block: { gap: "x1", pt: "x1" },
			heading: { gap: "x1" },
			title: {
				...typography.size16,
				fontWeight: "bold",
				color: "fg.neutral",
			},
			description: { ...typography.size13, color: "fg.neutralMuted" },
		},
		desktop: {
			block: { gap: "x2" },
			heading: { gap: "x1" },
			title: {
				...typography.size16,
				fontWeight: "bold",
				color: "fg.neutral",
			},
			description: { ...typography.size13, color: "fg.neutralMuted" },
		},
	});
