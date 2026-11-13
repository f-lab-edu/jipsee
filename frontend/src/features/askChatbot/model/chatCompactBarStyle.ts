import type {
	BoxProps,
	TextFieldRootProps,
	VStackProps,
} from "@seed-design/react";
import type { ChatHistoryIconLinkStyle } from "@/features/askChatbot/model/chatHistoryIconLinkStyle";
import type { ChatLoginLinkStyle } from "@/features/askChatbot/model/chatLoginLinkStyle";

export interface ChatCompactBarStyle {
	root: BoxProps;
	loggedOut: VStackProps;
	field: TextFieldRootProps;
	historyLink: ChatHistoryIconLinkStyle;
	loginLink: ChatLoginLinkStyle;
}
