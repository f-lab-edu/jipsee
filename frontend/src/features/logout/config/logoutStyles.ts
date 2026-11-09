import type { LogoutStyle } from "@/features/logout/model/logoutStyle";
import { typography } from "@/shared/config/typography";

export const logoutStyles: LogoutStyle = {
	button: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		width: "full",
		height: "48px",
		borderRadius: "r3",
		bg: "bg.neutralWeak",
	},
	text: { ...typography.size15, fontWeight: "bold", color: "fg.neutral" },
};
