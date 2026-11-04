import type { ChatExampleQuestionsStyle } from "@/features/askChatbot/model/chatExampleQuestionsStyle";
import { typography } from "@/shared/config/typography";

export const chatExampleQuestionsStyles: ChatExampleQuestionsStyle = {
	list: { gap: "x1" },
	text: { ...typography.size14, color: "fg.neutralMuted" },
};
