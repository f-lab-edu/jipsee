import type {
	HStackProps,
	IconProps,
	TextProps,
	VStackProps,
} from "@seed-design/react";
import type { ChatLoginLinkStyle } from "@/features/askChatbot/model/chatLoginLinkStyle";

export interface ChatExpandedPanelStyle {
	root: VStackProps;
	titleRow: HStackProps;
	titleIcon: Omit<IconProps, "svg">;
	title: TextProps;
	loginLink: ChatLoginLinkStyle;
}
