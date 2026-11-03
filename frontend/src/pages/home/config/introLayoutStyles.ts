import type { IntroLayoutStyle } from "@/pages/home/model/introLayoutStyle";
import { colors } from "@/shared/config/colors";
import { typography } from "@/shared/config/typography";
import { defineResponsiveStyles } from "@/shared/lib/defineResponsiveStyles";

export const introLayoutStyles = defineResponsiveStyles<IntroLayoutStyle>({
	mobile: {
		background: {
			position: "absolute",
			top: 0,
			right: 0,
			bottom: 0,
			left: 0,
			bg: colors.brandTintBackground,
		},
		titleRow: {
			alignItems: "flex-end",
			justifyContent: "space-between",
			gap: "x4",
		},
		titleBlock: { gap: "x2" },
		illustrationCell: { shrink: 0 },
		title: {
			...typography.size24,
			fontWeight: "bold",
			color: "fg.neutral",
		},
		description: { ...typography.size14, color: "fg.neutralMuted" },
		chips: { wrap: "wrap", gap: "x1_5" },
		chip: {
			display: "flex",
			px: "x2_5",
			py: "x1",
			borderRadius: "full",
			bg: "bg.layerDefault",
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
		titleBlock: { gap: "x2_5" },
		title: {
			...typography.size34,
			fontWeight: "bold",
			color: "fg.neutral",
			className: "tight-letter-spacing",
		},
		description: {
			...typography.size16LineHeight24,
			color: "fg.neutralMuted",
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
