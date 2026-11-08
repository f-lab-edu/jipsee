// C9 거래 이력: 마커 종류, 범례, 이전 건물 영역의 기대값
// 기대값 출처: 설계 3절(범례 문구), 5절(마커별 모양, 이전 건물 영역 폭), 7절(색), 캔버스 보드 S2(Mobile|Desktop)(Default|NoLoc|Few)와 DarkS2... 보드의 측정값

export const C9_LAYOUT = {
	// legendD: 범례 마커 지름. textX: 범례 항목 글자 왼쪽(범례 왼쪽 기준, 캔버스 측정값). noteX, noteY: 보조 문구 위치. 나머지는 거래 이력 제목 위쪽 기준 y
	mobile: {
		d: 12,
		legendD: 10,
		textX: [16, 68.17, 120.34, 172.52, 224.69, 302.45],
		noteX: 0,
		noteY: 27,
		legendH: 44,
		legendTop: 40,
		gridGap: 12,
		boxTop: 96,
		xRowBottom: 281,
		firstDate: { 1: 342, 4: 342, 3: 303 } as Record<number, number>,
		sectionBottom: { 1: 860, 4: 552, 3: 450 } as Record<number, number>,
		boxH: 160,
		pillTextW: 129.41,
	},
	desktop: {
		d: 14,
		legendD: 12,
		textX: [18, 72.17, 126.34, 180.52, 234.69, 314.45],
		noteX: 376.22,
		noteY: 1,
		legendH: 18,
		legendTop: 47,
		gridGap: 14,
		boxTop: 79,
		xRowBottom: 324,
		firstDate: { 1: 400, 4: 400, 3: 346 } as Record<number, number>,
		sectionBottom: { 1: 782, 4: 570, 3: 477 } as Record<number, number>,
		boxH: 220,
		pillTextW: 129.41,
	},
};

export type MarkerKind =
	| "default"
	| "cancelled"
	| "renewal"
	| "similar"
	| "previous";

// 캔버스 B.default, B.noloc, B.few의 마커 종류 (점 순서는 C8_DEALS와 같음). 캔버스 mod(): 이전 건물, 해제, 유사 건물, 갱신 순
export const C9_KINDS: Record<string, MarkerKind[]> = {
	default: ["default", "cancelled", "renewal", "similar", "default", "default"],
	noloc: ["default", "renewal", "default"],
	few: ["previous"],
};

// 설계 3절 범례 항목 순서와 캔버스 legend 배열의 모양과 색(C_J, C_S, C_N, C_N, C_N, C_P)
export const C9_LEGEND_ITEMS: {
	text: string;
	deal: "jeonse" | "sale";
	kind: MarkerKind;
	color: "jeonse" | "sale" | "muted" | "previous";
}[] = [
	{ text: "전세", deal: "jeonse", kind: "default", color: "jeonse" },
	{ text: "매매", deal: "sale", kind: "default", color: "sale" },
	{ text: "갱신", deal: "jeonse", kind: "renewal", color: "muted" },
	{ text: "해제", deal: "jeonse", kind: "cancelled", color: "muted" },
	{ text: "유사 건물", deal: "jeonse", kind: "similar", color: "muted" },
	{ text: "이전 건물", deal: "jeonse", kind: "previous", color: "previous" },
];

export const C9_NOTE = "월세는 목록에서 확인해요";

// 설계 5절, 계획 커밋 9: 이전 건물 2012.03, 현재 건물 거래 없음이면 13.12(상한 적용)
export const C9_BAND_PCT = 13.12;

// 캔버스 --seed-color-bg-neutral-weak (이전 건물 영역)
export const C9_BAND_FILL = {
	light: "rgb(243, 244, 245)",
	dark: "rgb(43, 46, 53)",
};
