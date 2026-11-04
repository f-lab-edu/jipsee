import type { BoxProps, TextFieldRootProps } from "@seed-design/react";
import type { ChatHistoryIconLinkStyle } from "@/features/askChatbot/model/chatHistoryIconLinkStyle";
import type { ChatLoginLinkStyle } from "@/features/askChatbot/model/chatLoginLinkStyle";

export interface ChatCompactBarStyle {
	root: BoxProps;
	field: TextFieldRootProps;
	historyLink: ChatHistoryIconLinkStyle;
	loginLink: ChatLoginLinkStyle;
}
