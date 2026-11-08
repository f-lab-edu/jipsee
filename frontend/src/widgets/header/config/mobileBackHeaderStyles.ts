import { typography } from "@/shared/config/typography";
import type { MobileBackHeaderStyle } from "@/widgets/header/model/mobileBackHeaderStyle";

export const mobileBackHeaderStyles: MobileBackHeaderStyle = {
	row: {
		height: "55px",
		px: "x1",
		gap: "x0_5",
		alignItems: "center",
		bg: "bg.layerDefault",
		borderBottomWidth: 1,
		borderColor: "stroke.neutralMuted",
	},
	backButton: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		flexShrink: 0,
		width: "44px",
		height: "44px",
	},
	backIcon: { size: "24px", color: "fg.neutral" },
	title: {
		...typography.size18LineHeight24,
		fontWeight: "bold",
		color: "fg.neutral",
		maxLines: 1,
	},
};
