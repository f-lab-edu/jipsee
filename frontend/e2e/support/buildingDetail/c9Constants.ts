// C9 거래 이력: 마커 종류, 범례의 기대값
// 기대값 출처: 설계 3절(범례 문구), 5절(마커별 모양), 7절(색), 캔버스 보드 S2(Mobile|Desktop)(Default|NoLoc)와 DarkS2... 보드의 측정값

export const C9_LAYOUT = {
	// legendD: 범례 마커 지름. textX: 범례 항목 글자 왼쪽(범례 왼쪽 기준, 캔버스 측정값). noteX, noteY: 보조 문구 위치. 나머지는 거래 이력 제목 위쪽 기준 y
	mobile: {
		d: 12,
		legendD: 10,
		// 본문 카드가 없어져 범례 폭이 358로 넓어지면 항목 다섯 개가 한 줄에 들어오고 보조 문구만 둘째 줄 왼쪽 끝에 놓임(2026-11-13 흰 세로 열)
		textX: [16, 68.17, 120.34, 172.52, 224.69],
		textY: [1, 1, 1, 1, 1],
		noteX: 0,
		noteY: 27,
		legendH: 44,
		legendTop: 40,
		gridGap: 12,
		boxTop: 96,
		xRowBottom: 281,
		firstDate: { 1: 342, 4: 342 } as Record<number, number>,
		sectionBottom: { 1: 860, 4: 552 } as Record<number, number>,
		boxH: 160,
	},
	desktop: {
		d: 14,
		legendD: 12,
		textX: [18, 72.17, 126.34, 180.52, 234.69],
		textY: [1, 1, 1, 1, 1],
		noteX: 296.45,
		noteY: 1,
		legendH: 18,
		legendTop: 47,
		gridGap: 14,
		boxTop: 79,
		xRowBottom: 324,
		firstDate: { 1: 400, 4: 400 } as Record<number, number>,
		sectionBottom: { 1: 782, 4: 570 } as Record<number, number>,
		boxH: 220,
	},
};

export type MarkerKind = "default" | "cancelled" | "renewal" | "similar";

// 캔버스 B.default, B.noloc의 마커 종류 (점 순서는 C8_DEALS와 같음). 캔버스 mod(): 해제, 유사 건물, 갱신 순
export const C9_KINDS: Record<string, MarkerKind[]> = {
	default: ["default", "cancelled", "renewal", "similar", "default", "default"],
	noloc: ["default", "renewal", "default"],
};

// 설계 3절 범례 항목 순서와 캔버스 legend 배열의 모양과 색(C_J, C_S, C_N, C_N, C_N)
export const C9_LEGEND_ITEMS: {
	text: string;
	deal: "jeonse" | "sale";
	kind: MarkerKind;
	color: "jeonse" | "sale" | "muted";
}[] = [
	{ text: "전세", deal: "jeonse", kind: "default", color: "jeonse" },
	{ text: "매매", deal: "sale", kind: "default", color: "sale" },
	{ text: "갱신", deal: "jeonse", kind: "renewal", color: "muted" },
	{ text: "해제", deal: "jeonse", kind: "cancelled", color: "muted" },
	{ text: "유사 건물", deal: "jeonse", kind: "similar", color: "muted" },
];

export const C9_NOTE = "월세는 목록에서 확인해요";
