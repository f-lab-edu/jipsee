import type { ChatMessageStyle } from "@/entities/chat/model/chatMessageStyle";
import { colors } from "@/shared/config/colors";
import { typography } from "@/shared/config/typography";

// 말풍선 모서리는 보낸 쪽 아래 모서리만 4임. 긴 글자 줄바꿈 클래스는 theme.css의 .chat-bubble에 있음
export const chatMessageStyles: ChatMessageStyle = {
	userArticle: {
		alignSelf: "flex-end",
		alignItems: "flex-end",
		maxWidth: { base: "86%", md: "72%" },
	},
	userBubble: {
		px: "x3_5",
		py: "x2_5",
		bg: colors.chatUserBubbleBackground,
		borderTopLeftRadius: "18px",
		borderTopRightRadius: "18px",
		borderBottomRightRadius: "4px",
		borderBottomLeftRadius: "18px",
		className: "chat-bubble",
	},
	userText: { ...typography.size15, color: "palette.staticWhite" },
	assistantArticle: {
		alignSelf: "flex-start",
		maxWidth: { base: "92%", md: "82%" },
	},
	assistantBubble: {
		px: "x3_5",
		py: "x3",
		bg: "bg.neutralWeak",
		borderTopLeftRadius: "18px",
		borderTopRightRadius: "18px",
		borderBottomRightRadius: "18px",
		borderBottomLeftRadius: "4px",
		className: "chat-bubble",
	},
	assistantLine: { ...typography.size15, color: "fg.neutral" },
	// Box가 content-box이므로 높이 46은 그대로 씀
	waitingBubble: {
		alignSelf: "flex-start",
		alignItems: "center",
		height: "46px",
		px: "x4",
		gap: "x1_5",
		bg: "bg.neutralWeak",
		borderTopLeftRadius: "18px",
		borderTopRightRadius: "18px",
		borderBottomRightRadius: "18px",
		borderBottomLeftRadius: "4px",
	},
	waitingDot: { className: "chat-dot" },
	caret: { className: "chat-caret" },
	sources: {
		mt: "x2",
		pt: "x2",
		borderTopWidth: 1,
		borderColor: "stroke.neutralWeak",
	},
	sourceLine: { ...typography.size12, color: "fg.neutralMuted" },
	buildingLink: {
		display: "flex",
		alignItems: "center",
		justifyContent: "flex-end",
		gap: "x0_5",
		minHeight: "44px",
		mt: "x1",
		mr: "-4px",
		mb: "-8px",
	},
	buildingLinkText: {
		...typography.size13,
		fontWeight: "bold",
		color: "fg.brand",
	},
	buildingLinkIcon: { size: "14px", color: "fg.brand" },
};
