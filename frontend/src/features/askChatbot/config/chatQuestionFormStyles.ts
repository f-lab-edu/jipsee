import type { ChatQuestionFormStyle } from "@/features/askChatbot/model/chatQuestionFormStyle";

export const chatQuestionFormStyles: ChatQuestionFormStyle = {
	sendButton: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		flexShrink: 0,
		width: "40px",
		height: "40px",
		p: 0,
		borderWidth: 0,
		borderRadius: "r2_5",
		color: "fg.onBrandSolid",
		className: "brand-filled-button",
	},
	sendIcon: { size: "18px" },
};
