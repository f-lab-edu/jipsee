import type {
	HStackProps,
	IconProps,
	TextProps,
	VStackProps,
} from "@seed-design/react";
import type { ChatHistoryLinkStyle } from "@/features/askChatbot/model/chatHistoryLinkStyle";
import type { ChatLoginLinkStyle } from "@/features/askChatbot/model/chatLoginLinkStyle";
import { bottomBarOffset } from "@/shared/config/bottomNavHeight";
import { typography } from "@/shared/config/typography";

export interface ChatExpandedPanelStyle {
	root: VStackProps;
	titleRow: HStackProps;
	titleIcon: Omit<IconProps, "svg">;
	title: TextProps;
	historyLink: ChatHistoryLinkStyle;
	loginLink: ChatLoginLinkStyle;
}

export const chatExpandedPanelStyles: ChatExpandedPanelStyle = {
	root: {
		hideFrom: "lg",
		position: "sticky",
		bottom: bottomBarOffset,
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
	historyLink: {
		box: {
			display: "flex",
			alignItems: "center",
			flexShrink: 0,
			height: "44px",
			px: "2px",
			ml: "auto",
		},
		text: { ...typography.size13, fontWeight: "bold", color: "fg.brand" },
	},
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
