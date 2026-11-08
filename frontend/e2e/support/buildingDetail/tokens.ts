/** 설계 7절 Seed 토큰 매핑의 기대값 (라이트와 다크) */
export const TOKENS = {
	light: {
		layerDefault: "rgb(255, 255, 255)",
		fgNeutral: "rgb(26, 28, 32)",
		fgMuted: "rgb(85, 93, 109)",
		strokeMuted: "rgba(0, 0, 0, 0.0627)",
		strokeWeak: "rgb(220, 222, 227)",
	},
	dark: {
		layerDefault: "rgb(22, 23, 27)",
		fgNeutral: "rgb(243, 244, 245)",
		fgMuted: "rgb(220, 222, 227)",
		strokeMuted: "rgba(255, 255, 255, 0.0902)",
		strokeWeak: "rgb(57, 61, 70)",
	},
};

export type Theme = keyof typeof TOKENS;
