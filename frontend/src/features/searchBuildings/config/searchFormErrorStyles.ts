import type { SearchFormErrorStyle } from "@/features/searchBuildings/model/searchFormErrorStyle";
import { typography } from "@/shared/config/typography";

export const searchFormErrorStyles: SearchFormErrorStyle = {
	line: { gap: "x1_5", alignItems: "center" },
	icon: { size: "x4", color: "palette.red800" },
	mobileCell: { display: "flex", hideFrom: "lg" },
	mobileText: {
		...typography.size13,
		fontWeight: "medium",
		color: "palette.red800",
	},
	desktopCell: { display: { base: "none", lg: "flex" } },
	desktopText: {
		...typography.size14,
		fontWeight: "medium",
		color: "palette.red800",
	},
};
