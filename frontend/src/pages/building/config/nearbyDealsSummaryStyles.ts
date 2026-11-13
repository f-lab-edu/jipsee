import type { NearbyDealsSummaryStyle } from "@/pages/building/model/nearbyDealsSummaryStyle";
import { typography } from "@/shared/config/typography";
import { defineResponsiveStyles } from "@/shared/lib/defineResponsiveStyles";

export const nearbyDealsSummaryStyles =
	defineResponsiveStyles<NearbyDealsSummaryStyle>({
		mobile: {
			summary: {
				justifyContent: "space-between",
				pt: "x1",
				className: "align-baseline",
			},
			count: { ...typography.size15, color: "fg.neutral" },
			countValue: { ...typography.size15, fontWeight: "bold" },
			baseMonth: {
				...typography.size12LineHeight16,
				color: "fg.neutralMuted",
			},
		},
		desktop: {
			summary: {
				justifyContent: "space-between",
				className: "align-baseline",
			},
			count: { ...typography.size16LineHeight24, color: "fg.neutral" },
			countValue: { ...typography.size16LineHeight24, fontWeight: "bold" },
			baseMonth: { ...typography.size13, color: "fg.neutralMuted" },
		},
	});
