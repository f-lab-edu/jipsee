import type { BoxProps, FlexProps, TextProps } from "@seed-design/react";
import { typography } from "@/shared/config/typography";
import { defineResponsiveStyles } from "@/shared/lib/defineResponsiveStyles";

export interface IntroLayoutStyle {
	background: BoxProps;
	chips: FlexProps;
	chip: BoxProps;
	chipLabel: TextProps;
}

export const introLayoutStyles = defineResponsiveStyles<IntroLayoutStyle>({
	mobile: {
		background: {
			position: "absolute",
			top: 0,
			right: 0,
			bottom: 0,
			left: 0,
			bg: "bg.layerDefault",
		},
		chips: { wrap: "wrap", gap: "x1_5" },
		chip: {
			display: "flex",
			px: "x2_5",
			py: "x1",
			borderRadius: "full",
			bg: "bg.neutralWeak",
		},
		chipLabel: { ...typography.size12, color: "fg.neutralMuted" },
	},
	desktop: {
		background: {
			position: "absolute",
			top: 0,
			right: 0,
			bottom: 0,
			left: 0,
			bg: "bg.layerDefault",
			borderWidth: 1,
			borderColor: "stroke.neutralMuted",
			borderRadius: "r5",
		},
		chips: { wrap: "wrap", gap: "x2" },
		chip: {
			display: "flex",
			px: "x3",
			py: "x1_5",
			borderRadius: "full",
			bg: "bg.brandWeak",
		},
		chipLabel: { ...typography.size13, color: "fg.neutralMuted" },
	},
});
