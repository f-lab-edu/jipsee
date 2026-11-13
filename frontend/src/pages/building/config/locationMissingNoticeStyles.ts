import type { LocationMissingNoticeStyle } from "@/pages/building/model/locationMissingNoticeStyle";
import { typography } from "@/shared/config/typography";
import { defineResponsiveStyles } from "@/shared/lib/defineResponsiveStyles";

export const locationMissingNoticeStyles =
	defineResponsiveStyles<LocationMissingNoticeStyle>({
		mobile: {
			notice: {
				display: "flex",
				alignItems: "flex-start",
				gap: "x2_5",
				minHeight: "22px",
				px: "x4",
				py: "x3_5",
				borderRadius: "r3",
				bg: "bg.neutralWeak",
			},
			iconCell: { display: "flex", flexShrink: 0, mt: "1px" },
			icon: { size: "18px", color: "fg.neutral" },
			text: { ...typography.size14, color: "fg.neutral" },
		},
		desktop: {
			notice: {
				display: "flex",
				alignItems: "center",
				gap: "x2_5",
				minHeight: "18px",
				px: "x4_5",
				py: "x4",
				borderRadius: "r3",
				bg: "bg.neutralWeak",
			},
			iconCell: { display: "flex", flexShrink: 0 },
			icon: { size: "20px", color: "fg.neutral" },
			text: { ...typography.size15, color: "fg.neutral" },
		},
	});
