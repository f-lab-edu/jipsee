import { footerMobileHeight } from "@/shared/config/bottomNavHeight";
import { typography } from "@/shared/config/typography";
import { defineResponsiveStyles } from "@/shared/lib/defineResponsiveStyles";
import type { FooterStyle } from "@/widgets/footer/model/footerStyle";

export const footerStyles = defineResponsiveStyles<FooterStyle>({
	mobile: {
		container: { px: "x4", bg: "bg.layerDefault" },
		linksRow: {
			height: footerMobileHeight,
			gap: "x5",
			justifyContent: "center",
			alignItems: "center",
		},
		linkText: { ...typography.size12, color: "fg.neutralMuted" },
		emphasizedLinkText: {
			...typography.size12,
			color: "fg.neutralMuted",
			fontWeight: "bold",
		},
	},
	desktop: {
		container: {
			borderTopWidth: 1,
			borderColor: "stroke.neutralMuted",
		},
		linksRow: { height: "48px", gap: "x6", alignItems: "center" },
		linkText: { ...typography.size13, color: "fg.neutralMuted" },
		emphasizedLinkText: {
			...typography.size13,
			color: "fg.neutralMuted",
			fontWeight: "bold",
		},
	},
});
