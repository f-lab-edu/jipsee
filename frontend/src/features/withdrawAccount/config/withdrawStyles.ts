import type { BoxProps } from "@seed-design/react";
import type { WithdrawStyle } from "@/features/withdrawAccount/model/withdrawStyle";
import { colors } from "@/shared/config/colors";
import { typography } from "@/shared/config/typography";

const buttonShared: BoxProps = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	height: "52px",
	borderRadius: "r3",
};

// 캔버스의 min-height 44, 패딩 0, 글자 밑줄 오프셋 2는 Seed에 속성이 없어 브라우저 기본값을 씀
export const withdrawStyles: WithdrawStyle = {
	trigger: {
		display: "flex",
		alignItems: "center",
		minHeight: "44px",
	},
	triggerText: {
		...typography.size13,
		color: "fg.neutralMuted",
		textDecorationLine: "underline",
	},
	contentClassName: "withdraw-dialog-content",
	// 위 패딩은 Seed 헤더와 같은 24, 아래 패딩은 Seed 푸터와 같은 바텀시트 16, 대화상자 24
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
	// 설명과 버튼 사이는 컬럼 간격 8에 바텀시트 16, 대화상자 20이 더해짐
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
