import type { BoxProps } from "@seed-design/react";
import type { DeleteChatStyle } from "@/features/deleteChat/model/deleteChatStyle";
import { typography } from "@/shared/config/typography";

const triggerShared: BoxProps = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	flexShrink: 0,
	bg: "bg.layerDefault",
	borderWidth: 1,
	borderColor: "stroke.neutralWeak",
	borderRadius: "full",
};

// button은 border-box라 시안의 최소 폭 56과 높이 44를 그대로 씀. 데스크톱 레일은 최소 폭 52와 높이 40임
export const deleteChatStyles: DeleteChatStyle = {
	trigger: {
		list: {
			...triggerShared,
			minWidth: "56px",
			height: "44px",
			px: "x3_5",
		},
		rail: {
			...triggerShared,
			minWidth: "52px",
			height: "40px",
			px: "x3",
		},
	},
	triggerText: {
		...typography.size13,
		fontWeight: "medium",
		color: "fg.neutral",
	},
};
