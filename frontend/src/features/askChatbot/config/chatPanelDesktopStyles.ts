import type { ChatPanelDesktopStyle } from "@/features/askChatbot/model/chatPanelDesktopStyle";
import { typography } from "@/shared/config/typography";

export const chatPanelDesktopStyles: ChatPanelDesktopStyle = {
	root: {
		position: "sticky",
		top: "var(--seed-dimension-x8)",
		flexGrow: 1,
		// 위 여백 32, 아래 여백 24, 위아래 padding 48, 테두리 2를 뺌. Seed Box는 content-box임
		maxHeight:
			"calc(100dvh - var(--seed-dimension-x8) - var(--seed-dimension-x6) * 3 - 2px)",
		gap: "x4",
		p: "x6",
		bg: "bg.layerFloating",
		borderWidth: 1,
		borderColor: "stroke.neutralMuted",
		borderRadius: "r5",
	},
	titleRow: { alignItems: "center", gap: "x2_5" },
	iconBox: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		width: "40px",
		height: "40px",
		bg: "bg.brandWeak",
		borderRadius: "r3",
	},
	icon: { size: "22px", color: "bg.brandSolid" },
	title: {
		...typography.size18LineHeight24,
		fontWeight: "bold",
		color: "fg.neutral",
	},
	loginLink: {
		box: {
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			height: "52px",
			mt: "auto",
			borderRadius: "r3",
			bg: "bg.brandWeak",
		},
		text: { ...typography.size15, fontWeight: "bold", color: "fg.brand" },
	},
};
