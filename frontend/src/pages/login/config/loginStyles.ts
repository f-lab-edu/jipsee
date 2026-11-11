import type { LoginStyle } from "@/pages/login/model/loginStyle";
import { typography } from "@/shared/config/typography";

export const loginStyles: LoginStyle = {
	main: { flexGrow: 1, className: "page-card" },
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
	actions: { gap: "x4" },
	providers: { gap: "x2_5" },
	errorNotice: {
		box: {
			alignItems: "center",
			gap: "x2_5",
			// Box가 content-box이므로 최소 높이 50에서 위아래 패딩 28을 뺌
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
	},
	notice: {
		group: { alignItems: "center" },
		consent: {
			...typography.size13LineHeight20,
			color: "fg.neutralMuted",
		},
		link: {
			...typography.size13LineHeight20,
			fontWeight: "bold",
			color: "fg.neutral",
			textDecorationLine: "underline",
		},
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
