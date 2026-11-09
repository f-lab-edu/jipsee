import type { LoginStyle } from "@/pages/login/model/loginStyle";
import { typography } from "@/shared/config/typography";

export const loginStyles: LoginStyle = {
	main: { flexGrow: 1 },
	mobileBody: {
		flexGrow: 1,
		justifyContent: "center",
		gap: "x8",
		pt: "x8",
		px: "spacingX.globalGutter",
		pb: "x6",
		bg: "bg.layerDefault",
	},
	desktopBody: {
		flexGrow: 1,
		alignItems: "center",
		justifyContent: "center",
		px: "x6",
		py: "x10",
	},
	// 폭 440에서 패딩 80과 테두리 2를 뺀 값. Box가 content-box이기 때문임
	card: {
		width: "358px",
		gap: "x8",
		p: "x10",
		bg: "bg.layerDefault",
		borderRadius: "r5",
		borderWidth: 1,
		borderColor: "stroke.neutralMuted",
	},
	intro: { alignItems: "center", gap: "x3" },
	logoSize: 64,
	title: {
		...typography.size28LineHeight36,
		color: "fg.neutral",
		className: "tight-letter-spacing extra-bold",
	},
	description: { ...typography.size15, color: "fg.neutralMuted" },
};
