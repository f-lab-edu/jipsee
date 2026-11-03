import { typography } from "@/shared/config/typography";
import { defineResponsiveStyles } from "@/shared/lib/defineResponsiveStyles";
import type { AccountLinkStyle } from "@/widgets/header/model/accountLinkStyle";

export const accountLinkStyles = defineResponsiveStyles<AccountLinkStyle>({
	mobile: {
		box: {
			display: "flex",
			alignItems: "center",
			height: "44px",
			px: "x1",
		},
		text: {
			...typography.size14,
			fontWeight: "medium",
			color: "fg.neutralMuted",
		},
	},
	desktop: {
		box: {
			display: "flex",
			alignItems: "center",
			height: "38px",
			px: "x4",
			borderRadius: "r2_5",
			bg: "bg.layerDefault",
			borderWidth: 1,
			borderColor: "stroke.neutralWeak",
		},
		text: { ...typography.size14, fontWeight: "bold", color: "fg.neutral" },
	},
});
