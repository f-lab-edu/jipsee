import type { BoxProps, TextFieldRootProps } from "@seed-design/react";
import type { ChatLoginLinkStyle } from "@/features/askChatbot/model/chatLoginLinkStyle";

export interface ChatCompactBarStyle {
	root: BoxProps;
	field: TextFieldRootProps;
	loginLink: ChatLoginLinkStyle;
}
