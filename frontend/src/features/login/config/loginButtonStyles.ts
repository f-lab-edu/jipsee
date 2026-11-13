import type { BoxProps, TextProps } from "@seed-design/react";
import { providerColors } from "@/entities/session/config/providerColors";
import type { LoginButtonStyle } from "@/features/login/model/loginButtonStyle";
import { typography } from "@/shared/config/typography";

const buttonShared: BoxProps = {
	position: "relative",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	borderRadius: "r3",
};

const labelShared: TextProps = { ...typography.size16, fontWeight: "bold" };

// Box가 content-box이므로 구글은 테두리 1을 높이와 좌우 패딩에서 뺌
export const loginButtonStyles: LoginButtonStyle = {
	button: {
		GOOGLE: {
			...buttonShared,
			height: "50px",
			px: "47px",
			bg: providerColors.GOOGLE.background,
			borderWidth: 1,
			borderColor: providerColors.GOOGLE.border,
		},
		KAKAO: {
			...buttonShared,
			height: "52px",
			px: "x12",
			bg: providerColors.KAKAO.background,
		},
		NAVER: {
			...buttonShared,
			height: "52px",
			px: "x12",
			bg: providerColors.NAVER.background,
		},
	},
	iconBox: {
		position: "absolute",
		top: 0,
		bottom: 0,
		left: "16px",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		width: "24px",
	},
	iconSize: { GOOGLE: 20, KAKAO: 20, NAVER: 16 },
	label: {
		GOOGLE: { ...labelShared, color: providerColors.GOOGLE.text },
		KAKAO: { ...labelShared, color: providerColors.KAKAO.text },
		NAVER: { ...labelShared, color: providerColors.NAVER.text },
	},
};
