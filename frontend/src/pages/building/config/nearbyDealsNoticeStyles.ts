import type { NearbyDealsNoticeStyle } from "@/pages/building/model/nearbyDealsNoticeStyle";
import { typography } from "@/shared/config/typography";
import { defineResponsiveStyles } from "@/shared/lib/defineResponsiveStyles";

export const nearbyDealsNoticeStyles =
	defineResponsiveStyles<NearbyDealsNoticeStyle>({
		mobile: {
			notice: {
				display: "flex",
				alignItems: "flex-start",
				gap: "x2_5",
				minHeight: "22px",
				px: "x4",
				py: "x3_5",
				borderRadius: "r3",
				bg: "bg.warningWeak",
			},
			iconCell: { display: "flex", flexShrink: 0, mt: "1px" },
			icon: { size: "18px", color: "fg.warningContrast" },
			textGroup: { display: "flex", flexDirection: "column", gap: "x0_5" },
			title: {
				...typography.size14,
				fontWeight: "bold",
				color: "fg.warningContrast",
			},
			body: { ...typography.size14, color: "fg.warningContrast" },
		},
		desktop: {
			notice: {
				display: "flex",
				alignItems: "flex-start",
				gap: "x2_5",
				minHeight: "22px",
				px: "x4_5",
				py: "x3_5",
				borderRadius: "r3",
				bg: "bg.warningWeak",
			},
			iconCell: { display: "flex", flexShrink: 0 },
			icon: { size: "20px", color: "fg.warningContrast" },
			textGroup: { display: "flex", flexDirection: "column", gap: "x0_5" },
			title: {
				...typography.size14,
				fontWeight: "bold",
				color: "fg.warningContrast",
			},
			body: { ...typography.size14, color: "fg.warningContrast" },
		},
	});
