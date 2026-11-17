import type { BoxProps, TextProps } from "@seed-design/react";
import { typography } from "@/shared/config/typography";

export interface WithdrawStyle {
	trigger: BoxProps;
	triggerText: TextProps;
}

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
};
