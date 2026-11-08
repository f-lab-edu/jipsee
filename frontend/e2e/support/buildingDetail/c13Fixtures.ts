import { ASIDE_X } from "./asideX";

// 기대값: 설계 2절(로그인 표), 3절(문구), 6절(반응형), 7절(색), 12절 20번(이동 경로)과 캔버스 보드 S2Mobile/Desktop(Dark) Default
// 모바일 바는 캔버스 border-box 107(위 border 1 + padding 12 + 버튼 52 + 간격 8 + 안내 18 + padding 16), 데스크톱 카드는 캔버스 132에 사용자가 정한 border 1px 두 줄을 더한 134임
export const ASK_TEXT = "이 건물에 대해 질문하기";
export const ASK_GUIDE = "누르면 로그인 화면으로 이동해요";
export const ASK_LOCK_PATH = "14|M8 11V7a4 4 0 0 1 8 0v4";
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
	guideGap: 8,
};
export const CARD_GEOM = {
	btnX: ASIDE_X + 25,
	btnW: 330,
	btnH: 56,
	btnRadius: "14px",
	guideGap: 10,
};
export const ASK_IDS = [1, 2, 3, 4, 5];
// 로그아웃(캔버스 loggedIn=false) 높이와 로그인 높이의 차이는 안내 한 줄(간격 8 또는 10과 높이 18)임
export const BAR_H = { out: 107, in: 81 };
export const CARD_H = { out: 134, in: 106 };
