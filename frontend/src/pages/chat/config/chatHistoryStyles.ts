import type { ChatHistoryStyle } from "@/pages/chat/model/chatHistoryStyle";
import { typography } from "@/shared/config/typography";

// Box가 content-box이므로 링크 최소 높이 68은 위아래 패딩 24를 뺀 44임. 목록 항목 높이는 아래 구분선 1이 더해짐
export const chatHistoryStyles: ChatHistoryStyle = {
	root: { flexGrow: 1 },
	list: { className: "list-reset" },
	item: {
		alignItems: "center",
		gap: "x2",
		px: { base: "spacingX.globalGutter", lg: "x6" },
		borderBottomWidth: 1,
		borderColor: "stroke.neutralMuted",
	},
	link: {
		flexGrow: 1,
		minWidth: "0px",
		minHeight: "44px",
		py: "x3",
		justifyContent: "center",
		gap: "x0_5",
	},
	title: {
		...typography.size15,
		fontWeight: "medium",
		color: "fg.neutral",
		className: "single-line-ellipsis",
	},
	time: { ...typography.size12, color: "fg.neutralMuted" },
	empty: {
		flexGrow: 1,
		alignItems: "center",
		justifyContent: "center",
		gap: "x2",
		px: { base: "spacingX.globalGutter", lg: "x6" },
		py: "x6",
	},
	emptyText: { ...typography.size16, fontWeight: "bold", color: "fg.neutral" },
};
