import type { BaseMonthNoticeStyle } from "@/pages/home/model/baseMonthNoticeStyle";
import { typography } from "@/shared/config/typography";
import { defineResponsiveStyles } from "@/shared/lib/defineResponsiveStyles";

export const baseMonthNoticeStyles =
	defineResponsiveStyles<BaseMonthNoticeStyle>({
		mobile: {
			root: {
				alignItems: "flex-start",
				gap: "x1_5",
				px: "x3",
				py: "x2_5",
				bg: "bg.informativeWeak",
				borderRadius: "r2_5",
			},
			iconCell: { display: "flex", flexShrink: 0, mt: "2px" },
			icon: { size: "14px", color: "fg.neutralMuted" },
			text: { ...typography.size12, color: "fg.neutralMuted" },
			highlight: {
				...typography.size12,
				fontWeight: "bold",
				color: "fg.brand",
			},
		},
		desktop: {
			root: {
				px: "x3",
				py: "x2",
				bg: "bg.informativeWeak",
				borderRadius: "r2_5",
			},
			text: { ...typography.size13, align: "right", color: "fg.neutralMuted" },
			highlight: {
				...typography.size13,
				fontWeight: "bold",
				color: "fg.brand",
			},
		},
	});
