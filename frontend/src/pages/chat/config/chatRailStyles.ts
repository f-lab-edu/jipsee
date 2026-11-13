import type { ChatRailStyle } from "@/pages/chat/model/chatRailStyle";
import { typography } from "@/shared/config/typography";

const newChatShared = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	gap: "x1_5",
	height: "42px",
	px: "x4",
	borderWidth: 1,
	borderRadius: "r3",
} as const;

const itemShared = {
	alignItems: "center",
	gap: "x1",
	minHeight: "62px",
	pl: "x3",
	pr: "x2",
	borderWidth: 1,
	borderRadius: "r3",
} as const;

const linkTitleShared = {
	...typography.size14,
	color: "fg.neutral",
	className: "single-line-ellipsis",
} as const;

// Box가 content-box이므로 테두리가 있는 요소는 높이에서 테두리 2를 뺌(새 대화 링크 44, 항목 최소 높이 64). button은 border-box라 시안의 높이를 그대로 씀
// 레일은 카드 높이에 묶이도록 안쪽을 절대 위치로 두고 목록만 세로로 스크롤함
export const chatRailStyles: ChatRailStyle = {
	root: {
		display: { base: "none", lg: "flex" },
		position: "relative",
		flexShrink: 0,
		width: "295px",
		bg: "bg.neutralWeak",
		borderRightWidth: 1,
		borderColor: "stroke.neutralMuted",
	},
	inner: {
		position: "absolute",
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
	},
	toolbar: { gap: "14px", pt: "18px", pb: "x3", px: "x4" },
	titleBox: { ml: "x1" },
	title: { ...typography.size22, fontWeight: "bold", color: "fg.neutral" },
	newChat: {
		...newChatShared,
		bg: "bg.layerDefault",
		borderColor: "stroke.neutralWeak",
	},
	newChatCurrent: {
		...newChatShared,
		bg: "bg.brandWeak",
		borderColor: "stroke.brandSolid",
	},
	newChatIcon: { size: "18px" },
	newChatText: {
		...typography.size14,
		fontWeight: "bold",
		color: "fg.neutral",
	},
	newChatCurrentText: {
		...typography.size14,
		fontWeight: "bold",
		color: "fg.brand",
	},
	headingBox: { pt: "x2", pb: "x1_5", px: "x5" },
	heading: {
		...typography.size12,
		fontWeight: "bold",
		color: "fg.neutralMuted",
	},
	nav: { flexGrow: 1, minHeight: "0px", overflowY: "auto", px: "x2" },
	list: { gap: "x0_5", className: "list-reset" },
	item: { ...itemShared, borderColor: "transparent" },
	itemCurrent: {
		...itemShared,
		bg: "bg.layerDefault",
		borderColor: "stroke.neutralWeak",
	},
	link: {
		flexGrow: 1,
		minWidth: "0px",
		justifyContent: "center",
		gap: "1px",
		py: "10px",
	},
	linkTitle: { ...linkTitleShared, fontWeight: "medium" },
	linkTitleCurrent: { ...linkTitleShared, fontWeight: "bold" },
	linkTime: { ...typography.size12, color: "fg.neutralMuted" },
	empty: { flexGrow: 1, alignItems: "center", px: "x4", py: "40px" },
	emptyText: { ...typography.size14, color: "fg.neutralMuted" },
};
