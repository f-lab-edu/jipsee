import type { HomeBackLinkStyle } from "@/pages/search/model/homeBackLinkStyle";
import { typography } from "@/shared/config/typography";

export const homeBackLinkStyles: HomeBackLinkStyle = {
	link: {
		display: { base: "none", lg: "inline-flex" },
		alignItems: "center",
		alignSelf: "flex-start",
		gap: "x1",
	},
	icon: { size: "16px", color: "fg.neutralMuted" },
	label: { ...typography.size14, color: "fg.neutralMuted" },
};
