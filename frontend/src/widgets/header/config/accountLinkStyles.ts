import { typography } from "@/shared/config/typography";
import type { AccountLinkStyle } from "@/widgets/header/model/accountLinkStyle";

export const accountLinkStyles: AccountLinkStyle = {
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
};
