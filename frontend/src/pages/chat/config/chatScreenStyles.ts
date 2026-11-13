import type { ChatScreenStyle } from "@/pages/chat/model/chatScreenStyle";
import { typography } from "@/shared/config/typography";

// 카드 폭은 1152에서 테두리 2를 뺌. 카드 모양은 theme.css의 .chat-card가 정함
const cardShared = {
	width: { base: "full", lg: "1150px" },
	mx: "auto",
	flexGrow: 1,
	className: "chat-card",
} as const;

// Box가 content-box이므로 테두리 1이 있는 버튼은 높이에서 테두리 2를 뺌. 도구줄은 1280 미만에서만 보임
export const chatScreenStyles: ChatScreenStyle = {
	main: {
		flexGrow: 1,
		px: { base: 0, lg: "x6" },
		py: { base: 0, lg: "x6" },
	},
	card: cardShared,
	// 대화 목록 화면의 카드. 1280 이상은 /chat으로 이동하므로 이동 전에 보이지 않게 함
	hiddenOnDesktopCard: { ...cardShared, display: { base: "flex", lg: "none" } },
	pane: { flexGrow: 1, minWidth: "0px" },
	toolbar: {
		root: {
			alignItems: "center",
			justifyContent: "space-between",
			gap: "x2",
			minHeight: "44px",
			py: "x2",
			px: "spacingX.globalGutter",
		},
		titleGroup: { alignItems: "center", minWidth: "0px" },
		title: { ...typography.size20, fontWeight: "bold", color: "fg.neutral" },
		actions: { alignItems: "center", gap: "x2", flexShrink: 0 },
		button: {
			display: "flex",
			alignItems: "center",
			px: "x4",
			height: "42px",
			borderWidth: 1,
			borderColor: "stroke.neutralWeak",
			borderRadius: "full",
		},
		buttonText: {
			...typography.size14,
			fontWeight: "medium",
			color: "fg.neutral",
		},
	},
	chipWrapper: {
		px: { base: "spacingX.globalGutter", lg: "x6" },
		pt: { base: 0, lg: "x4" },
		pb: { base: "x3", lg: 0 },
	},
	chipColumn: { width: "full", maxWidth: "720px", mx: "auto" },
	chip: {
		alignSelf: "flex-start",
		alignItems: "center",
		gap: "x1_5",
		height: "32px",
		px: "x3",
		bg: "bg.brandWeak",
		borderRadius: "full",
	},
	chipIcon: { size: "14px", color: "fg.brand" },
	chipText: { ...typography.size13, fontWeight: "bold", color: "fg.brand" },
};
