import type { DealHistorySectionStyle } from "@/pages/building/model/dealHistorySectionStyle";
import { typography } from "@/shared/config/typography";
import { defineResponsiveStyles } from "@/shared/lib/defineResponsiveStyles";

export const dealHistorySectionStyles =
	defineResponsiveStyles<DealHistorySectionStyle>({
		mobile: {
			section: {
				gap: "x4",
				bg: "bg.layerDefault",
				pt: "x5",
				px: "spacingX.globalGutter",
				pb: "x6",
			},
			title: {
				...typography.size18LineHeight24,
				fontWeight: "bold",
				color: "fg.neutral",
			},
		},
		desktop: {
			section: {
				gap: "x5",
				bg: "bg.layerDefault",
				py: "x7",
				px: "x8",
				borderRadius: "r5",
				borderWidth: 1,
				borderColor: "stroke.neutralMuted",
			},
			title: {
				...typography.size20LineHeight27,
				fontWeight: "bold",
				color: "fg.neutral",
			},
		},
	});
