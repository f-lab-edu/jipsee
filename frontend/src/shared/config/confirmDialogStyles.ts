import type { BoxProps } from "@seed-design/react";
import { colors } from "@/shared/config/colors";
import { typography } from "@/shared/config/typography";
import type { ConfirmDialogStyle } from "@/shared/model/confirmDialogStyle";

const buttonShared: BoxProps = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	height: "52px",
	borderRadius: "r3",
};

// 위 패딩은 Seed 헤더와 같은 24, 아래 패딩은 Seed 푸터와 같은 바텀시트 16, 대화상자 24
// 설명과 버튼 사이는 컬럼 간격 8에 바텀시트 16, 대화상자 20이 더해짐
export const confirmDialogStyles: ConfirmDialogStyle = {
	contentClassName: "confirm-dialog-content",
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
	confirmButton: { ...buttonShared, bg: colors.destructiveButtonBackground },
	confirmText: {
		...typography.size16,
		fontWeight: "bold",
		color: "palette.staticWhite",
	},
};
