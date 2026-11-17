import type { TextProps, VStackProps } from "@seed-design/react";
import { typography } from "@/shared/config/typography";

export interface ChatExampleQuestionsStyle {
	list: VStackProps;
	text: TextProps;
}

export const chatExampleQuestionsStyles: ChatExampleQuestionsStyle = {
	list: { gap: "x1" },
	text: { ...typography.size14, color: "fg.neutralMuted" },
};
