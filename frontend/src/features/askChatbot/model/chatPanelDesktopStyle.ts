import type {
	BoxProps,
	HStackProps,
	IconProps,
	TextProps,
	VStackProps,
} from "@seed-design/react";
import type { ChatHistoryLinkStyle } from "@/features/askChatbot/model/chatHistoryLinkStyle";
import type { ChatLoginLinkStyle } from "@/features/askChatbot/model/chatLoginLinkStyle";

export interface ChatPanelDesktopStyle {
	root: VStackProps;
	titleRow: HStackProps;
	iconBox: BoxProps;
	icon: Omit<IconProps, "svg">;
	title: TextProps;
	historyLink: ChatHistoryLinkStyle;
	questionForm: BoxProps;
	loginLink: ChatLoginLinkStyle;
}
