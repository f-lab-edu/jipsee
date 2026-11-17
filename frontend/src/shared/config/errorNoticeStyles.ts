import type {
	BoxProps,
	HStackProps,
	IconProps,
	TextProps,
} from "@seed-design/react";
import { typography } from "@/shared/config/typography";

export interface ErrorNoticeStyle {
	box: HStackProps;
	iconCell: BoxProps;
	icon: Omit<IconProps, "svg">;
	text: TextProps;
}

// 로그인 실패 안내와 같은 모양임. Box가 content-box이므로 최소 높이 50에서 위아래 패딩 28 제외
export const errorNoticeStyles: ErrorNoticeStyle = {
	box: {
		alignItems: "center",
		gap: "x2_5",
		minHeight: "22px",
		px: "x4",
		py: "x3_5",
		borderRadius: "r3",
		bg: "bg.criticalWeak",
	},
	iconCell: { display: "flex", flexShrink: 0 },
	icon: { size: "18px", color: "fg.criticalContrast" },
	text: {
		...typography.size14,
		fontWeight: "medium",
		color: "fg.criticalContrast",
	},
};
