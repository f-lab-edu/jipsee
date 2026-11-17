import type { TextProps, VStackProps } from "@seed-design/react";
import { typography } from "@/shared/config/typography";
import { defineResponsiveStyles } from "@/shared/lib/defineResponsiveStyles";

export interface PreviousBuildingDealsStyle {
	block: VStackProps;
	heading: VStackProps;
	title: TextProps;
	description: TextProps;
}

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
