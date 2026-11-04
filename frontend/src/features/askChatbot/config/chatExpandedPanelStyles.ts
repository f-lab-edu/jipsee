import type { ChatExpandedPanelStyle } from "@/features/askChatbot/model/chatExpandedPanelStyle";
import { typography } from "@/shared/config/typography";

export const chatExpandedPanelStyles: ChatExpandedPanelStyle = {
	root: {
		hideFrom: "lg",
		position: "sticky",
		bottom: 0,
		gap: "x3",
		pt: "x4_5",
		px: "spacingX.globalGutter",
		pb: "x4",
		bg: "bg.layerFloating",
		borderTopLeftRadius: "r4",
		borderTopRightRadius: "r4",
		borderTopWidth: 1,
		borderColor: "stroke.neutralMuted",
		className: "chat-panel-shadow",
	},
	titleRow: { alignItems: "center", gap: "x2" },
	titleIcon: { size: "x5", color: "bg.brandSolid" },
	title: { ...typography.size16, fontWeight: "bold", color: "fg.neutral" },
	loginLink: {
		box: {
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			height: "48px",
			borderRadius: "r3",
			bg: "bg.brandWeak",
		},
		text: { ...typography.size15, fontWeight: "bold", color: "fg.brand" },
	},
};
