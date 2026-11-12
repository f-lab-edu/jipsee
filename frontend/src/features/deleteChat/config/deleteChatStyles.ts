import type { BoxProps } from "@seed-design/react";
import type { DeleteChatStyle } from "@/features/deleteChat/model/deleteChatStyle";
import { colors } from "@/shared/config/colors";
import { typography } from "@/shared/config/typography";

const buttonShared: BoxProps = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	height: "52px",
	borderRadius: "r3",
};

// button은 border-box라 시안의 최소 폭 56과 높이 44를 그대로 씀
// 확인 창은 S5 탈퇴 확인 창과 같은 값이고 삭제하기 배경도 탈퇴하기와 같은 색임
export const deleteChatStyles: DeleteChatStyle = {
	trigger: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		flexShrink: 0,
		minWidth: "56px",
		height: "44px",
		px: "x3_5",
		bg: "bg.layerDefault",
		borderWidth: 1,
		borderColor: "stroke.neutralWeak",
		borderRadius: "full",
	},
	triggerText: {
		...typography.size13,
		fontWeight: "medium",
		color: "fg.neutral",
	},
	contentClassName: "delete-chat-dialog-content",
	body: { gap: "x2", pt: "x6", pb: { base: "x4", lg: "x6" } },
	title: {
		...typography.size20LineHeight27,
		fontWeight: "bold",
		color: "fg.neutral",
	},
	description: {
		...typography.size15,
		fontWeight: "regular",
		color: "fg.neutralMuted",
	},
	form: { mt: { base: "x4", lg: "x5" } },
	buttons: { columns: 2, gap: "x2" },
	cancelButton: { ...buttonShared, bg: "bg.neutralWeak" },
	cancelText: { ...typography.size16, fontWeight: "bold", color: "fg.neutral" },
	confirmButton: { ...buttonShared, bg: colors.withdrawButtonBackground },
	confirmText: {
		...typography.size16,
		fontWeight: "bold",
		color: "palette.staticWhite",
	},
};
