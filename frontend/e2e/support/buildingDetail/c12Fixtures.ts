// 기대값 출처: 설계 2절(상태표 "조건 확장 안내"), 3절(문구), 7절(색 bg.warningWeak, fg.warningContrast), 캔버스 S2(Mobile|Desktop)(Few|Zero)와 Dark* 보드
export const C12_TOKENS = {
	light: { bg: "#fff7de", fg: "#4f3e1f" },
	dark: { bg: "#302819", fg: "#e5d49b" },
};
export const C12_BODY = "반경이나 기간을 넓혀 보세요";
export const C12_NONE = "조건에 맞는 거래가 없어요";

export type C12State = {
	id: number;
	q: string;
	title: string | null;
	count?: number;
	secM?: number;
	secD?: number;
	yM?: number;
	yD?: number;
	label: string;
};

// 설계 2절 상태표. 건수가 3 미만일 때만 안내가 있고, id 5는 id 1과 같은 값
// secM과 secD는 캔버스 섹션 높이(모바일), 캔버스 높이에 카드 위아래 테두리 2를 더한 값(데스크톱). y는 캔버스 섹션 위쪽 좌표
export const C12_ID2_WOLSE: C12State = {
	id: 2,
	q: "?type=wolse",
	title: C12_NONE,
	secM: 454,
	secD: 409,
	yM: 1866,
	yD: 995,
	label: "id 2 월세",
};
export const C12_ID3_WOLSE: C12State = {
	id: 3,
	q: "?type=wolse",
	title: "조건에 맞는 거래 1건",
	count: 1,
	secM: 513,
	secD: 489,
	yM: 1088,
	yD: 690,
	label: "id 3 월세",
};
export const C12_STATES: C12State[] = [
	{ id: 1, q: "", title: null, label: "id 1 전세" },
	{ id: 1, q: "?type=wolse", title: null, label: "id 1 월세" },
	{
		id: 2,
		q: "",
		title: C12_NONE,
		secM: 454,
		secD: 409,
		yM: 1866,
		yD: 995,
		label: "id 2 전세",
	},
	C12_ID2_WOLSE,
	{
		id: 3,
		q: "",
		title: "조건에 맞는 거래 2건",
		count: 2,
		secM: 586,
		secD: 542,
		yM: 1088,
		yD: 690,
		label: "id 3 전세",
	},
	C12_ID3_WOLSE,
	{ id: 5, q: "", title: null, label: "id 5 전세" },
	{ id: 5, q: "?type=wolse", title: null, label: "id 5 월세" },
];
