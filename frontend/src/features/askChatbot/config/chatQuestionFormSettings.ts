import { chatPanelCopy } from "@/features/askChatbot/config/chatPanelCopy";
import type { ChatQuestionFormVariant } from "@/features/askChatbot/model/chatQuestionFormVariant";

export const chatQuestionFormSettings: Record<
	ChatQuestionFormVariant,
	{ placeholder: string; className: string }
> = {
	expandedPanel: {
		placeholder: chatPanelCopy.questionPlaceholder,
		className: "chat-input--expanded",
	},
	desktopAside: {
		placeholder: chatPanelCopy.questionPlaceholder,
		className: "chat-input--aside",
	},
	compactBar: {
		placeholder: chatPanelCopy.compactPlaceholder,
		className: "chat-input--compact",
	},
};
