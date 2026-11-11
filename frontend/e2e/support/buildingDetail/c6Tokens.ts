// 거래 이력 이후 섹션이 쓰는 Seed 토큰 hex 기대값 (라이트와 다크)
export const C6_TOKENS = {
	light: {
		fgNeutral: "#1a1c20",
		fgMuted: "#555d6d",
		fgSubtle: "#868b94",
		layerDefault: "#ffffff",
		layerBasement: "#f3f4f5",
		strokeWeak: "#dcdee3",
		brandWeak: "#eff6ff",
		informativeContrast: "#0b4596",
		positiveWeak: "#edfaf6",
		positiveContrast: "#075445",
		warningWeak: "#fff7de",
		warningContrast: "#4f3e1f",
		criticalWeak: "#fed4d2",
		red800: "#ca1d13",
	},
	dark: {
		fgNeutral: "#f3f4f5",
		fgMuted: "#dcdee3",
		fgSubtle: "#b0b3ba",
		layerDefault: "#16171b",
		layerBasement: "#000000",
		strokeWeak: "#393d46",
		brandWeak: "#202742",
		informativeContrast: "#b9d7fb",
		positiveWeak: "#202926",
		positiveContrast: "#93e5c0",
		warningWeak: "#302819",
		warningContrast: "#e5d49b",
		criticalWeak: "#742826",
		red800: "#ffa299",
	},
};

export type C6Tokens = (typeof C6_TOKENS)[keyof typeof C6_TOKENS];
