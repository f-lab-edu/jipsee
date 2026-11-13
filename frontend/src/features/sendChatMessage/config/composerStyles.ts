import type { ComposerStyle } from "@/features/sendChatMessage/model/composerStyle";
import { typography } from "@/shared/config/typography";

const sendButtonShared = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	flexShrink: 0,
	width: "40px",
	height: "40px",
	p: 0,
	borderWidth: 0,
	borderRadius: "r2_5",
} as const;

const barShared = {
	px: { base: "spacingX.globalGutter", lg: "x6" },
	py: { base: "x3", lg: "x4" },
	borderTopWidth: 1,
	borderColor: "stroke.neutralMuted",
	className: "chat-bar",
} as const;

// 모바일 바 패딩 12 16, 데스크톱 16 24. 위치와 그림자, 배경은 theme.css의 .chat-bar가 정함
export const composerStyles: ComposerStyle = {
	bar: barShared,
	limitBar: { ...barShared, className: "chat-bar chat-limit-bar" },
	field: { className: "chat-bar-input" },
	sendButton: {
		...sendButtonShared,
		color: "fg.onBrandSolid",
		className: "brand-filled-button",
	},
	sendButtonDisabled: {
		...sendButtonShared,
		bg: "stroke.neutralWeak",
		color: "fg.neutralMuted",
	},
	sendIcon: { size: "18px" },
	limitBox: {
		alignItems: "flex-start",
		gap: "x2_5",
		px: "x3_5",
		py: "x3",
		bg: "bg.warningWeak",
		borderWidth: 1,
		borderColor: "stroke.warningWeak",
		borderRadius: "r3",
	},
	limitIconCell: { display: "flex", flexShrink: 0, mt: "1px" },
	limitIcon: { size: "18px", color: "fg.warningContrast" },
	limitText: { gap: "x0_5" },
	limitTitle: {
		...typography.size14,
		fontWeight: "bold",
		color: "fg.warningContrast",
	},
	limitDescription: { ...typography.size13, color: "fg.warningContrast" },
};
