import type { ChatCompactBarStyle } from "@/features/askChatbot/model/chatCompactBarStyle";
import { typography } from "@/shared/config/typography";

export const chatCompactBarStyles: ChatCompactBarStyle = {
	root: {
		hideFrom: "lg",
		position: "sticky",
		bottom: 0,
		py: "x3",
		px: "spacingX.globalGutter",
		bg: "bg.layerFloating",
		borderTopWidth: 1,
		borderColor: "stroke.neutralMuted",
		className: "chat-panel-shadow",
	},
	loggedOut: { gap: "x2" },
	field: { className: "chat-input--compact" },
	historyLink: {
		box: {
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			flexShrink: 0,
			width: "36px",
			height: "36px",
			ml: "-8px",
			borderRadius: "r2",
			color: "fg.neutralMuted",
		},
		icon: { size: "x5" },
	},
	loginLink: {
		box: {
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			height: "44px",
			borderRadius: "r3",
			bg: "bg.brandWeak",
		},
		text: { ...typography.size15, fontWeight: "bold", color: "fg.brand" },
	},
};
