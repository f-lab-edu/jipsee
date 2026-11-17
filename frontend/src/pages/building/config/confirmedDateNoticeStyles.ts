import type { BoxProps, IconProps, TextProps } from "@seed-design/react";
import { typography } from "@/shared/config/typography";
import { defineResponsiveStyles } from "@/shared/lib/defineResponsiveStyles";

export interface ConfirmedDateNoticeStyle {
	notice: BoxProps;
	iconCell: BoxProps;
	icon: Omit<IconProps, "svg">;
	text: TextProps;
}

export const confirmedDateNoticeStyles =
	defineResponsiveStyles<ConfirmedDateNoticeStyle>({
		mobile: {
			notice: {
				display: "flex",
				alignItems: "flex-start",
				gap: "x2_5",
				minHeight: "22px",
				px: "x4",
				py: "x3_5",
				borderRadius: "r3",
				bg: "bg.informativeWeak",
			},
			iconCell: { display: "flex", flexShrink: 0, mt: "1px" },
			icon: { size: "18px", color: "fg.informativeContrast" },
			text: { ...typography.size14, color: "fg.informativeContrast" },
		},
		desktop: {
			notice: {
				display: "flex",
				alignItems: "center",
				gap: "x2_5",
				minHeight: "22px",
				px: "x4_5",
				py: "x3_5",
				borderRadius: "r3",
				bg: "bg.informativeWeak",
			},
			iconCell: { display: "flex", flexShrink: 0 },
			icon: { size: "20px", color: "fg.informativeContrast" },
			text: { ...typography.size14, color: "fg.informativeContrast" },
		},
	});
