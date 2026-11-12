import type {
	ChatScreenStyle,
	ChatToolbarStyle,
} from "@/pages/chat/model/chatScreenStyle";
import { typography } from "@/shared/config/typography";

// Box가 content-box이므로 테두리 1이 있는 버튼은 높이에서 테두리 2를 뺌. 모바일 44, 데스크톱 40
const toolbarShared = {
	button: {
		display: "flex",
		alignItems: "center",
		px: "x4",
		borderWidth: 1,
		borderColor: "stroke.neutralWeak",
		borderRadius: "full",
	},
	buttonText: {
		...typography.size14,
		fontWeight: "medium",
		color: "fg.neutral",
	},
	backButton: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		flexShrink: 0,
		width: "44px",
		height: "44px",
		ml: "-10px",
	},
	backIcon: { size: "24px", color: "fg.neutral" },
} as const satisfies Partial<ChatToolbarStyle>;

export const chatScreenStyles: ChatScreenStyle = {
	main: {
		flexGrow: 1,
		px: { base: 0, lg: "x6" },
		py: { base: 0, lg: "x6" },
	},
	// 데스크톱은 폭 720에서 테두리 2를 뺌. 카드 모양은 theme.css의 .chat-card가 정함
	card: {
		width: { base: "full", lg: "718px" },
		mx: "auto",
		flexGrow: 1,
		className: "chat-card",
	},
	toolbar: {
		mobile: {
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
			...toolbarShared,
			button: { ...toolbarShared.button, height: "42px" },
		},
		desktop: {
			root: {
				alignItems: "center",
				justifyContent: "space-between",
				gap: "x2",
				minHeight: "36px",
				py: "x3",
				px: "x6",
				borderBottomWidth: 1,
				borderColor: "stroke.neutralMuted",
			},
			titleGroup: { alignItems: "center", minWidth: "0px" },
			title: { ...typography.size22, fontWeight: "bold", color: "fg.neutral" },
			actions: { alignItems: "center", gap: "x2", flexShrink: 0 },
			...toolbarShared,
			button: { ...toolbarShared.button, height: "38px" },
		},
	},
	chipWrapper: {
		px: { base: "spacingX.globalGutter", lg: "x6" },
		pt: { base: 0, lg: "x3" },
		pb: { base: "x3", lg: 0 },
	},
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
