import { ASIDE_X } from "./asideX";

// 기대값: 설계 2절(로그인 표), 3절(문구), 6절(반응형), 7절(색), 12절 20번(이동 경로)과 캔버스 보드 S2Mobile/Desktop(Dark) Default
// 2026-11-09 피드백 10번: 안내 한 줄을 지워 로그인 여부와 상관없이 모바일 바는 81(위 border 1 + padding 12 + 버튼 52 + padding 16), 데스크톱 카드는 106(border 2 + padding 48 + 버튼 56)임
export const ASK_TEXT = "이 건물에 대해 질문하기";
export const ASK_GUIDE = "누르면 로그인 화면으로 이동해요";
export const ASK_TOKENS = {
	light: {
		floating: "rgb(255, 255, 255)",
		buttonBg: "rgb(19, 95, 205)",
		shadowAlpha: 0.06,
		fgOnBrand: "rgb(255, 255, 255)",
	},
	dark: {
		floating: "rgb(29, 32, 37)",
		buttonBg: "rgb(25, 100, 216)",
		shadowAlpha: 0.4,
		fgOnBrand: "rgb(255, 255, 255)",
	},
};

// 데스크톱 aside 열 폭 (설계 2절, 6절)
export const ASK_ASIDE_W = 380;
export const BAR_GEOM = {
	btnX: 16,
	btnW: 358,
	btnH: 52,
	btnRadius: "12px",
};
export const CARD_GEOM = {
	btnX: ASIDE_X + 25,
	btnW: 330,
	btnH: 56,
	btnRadius: "14px",
};
export const ASK_IDS = [1, 2, 3, 4, 5];
export const BAR_H = 81;
export const CARD_H = 106;
