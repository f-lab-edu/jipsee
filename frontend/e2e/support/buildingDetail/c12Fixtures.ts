// 기대값 출처: 설계 2절(상태표 "조건 확장 안내"), 3절(문구), 7절(색 bg.warningWeak, fg.warningContrast), 캔버스 S2(Mobile|Desktop)(Few|Zero)와 Dark* 보드
export const C12_TOKENS = {
	light: { bg: "#fff7de", fg: "#4f3e1f" },
	dark: { bg: "#302819", fg: "#e5d49b" },
};
export const C12_BODY = "기간을 넓혀 보세요";
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

// 설계 2절 상태표. 건수가 3 미만일 때만 안내가 있고, id 4는 id 2와 같은 0건 상태(크기 값 없음), id 5는 id 1과 같은 값
// 2026-11-09 피드백 7번(모바일 본문 카드 첫 줄 건물명 제목 44)과 9번(선택 상자 높이 모바일 52, 데스크톱 40)을 반영해 캔버스 값에서 모바일 y +44, 모바일 높이 -14, 데스크톱 높이 +4로 고침
// 2026-11-21 모바일 secM은 캔버스 값에서 62를 뺌. 캔버스는 필터 그룹 셋이 두 줄로 줄바꿈되고, 반경을 지워 그룹 둘이 한 줄에 들어오므로 한 줄(선택 상자 52 + 행 간격 10)이 줄어듦. 데스크톱은 한 줄 그대로라 같음
// 2026-11-23 건축물대장 표제부 UI 제거로 건물 정보 섹션이 외부 링크 영역만 남아 모바일 y가 줄고(id 2 1910 -> 1062, id 3 1132 -> 277), 면적 고정 줄이 모든 건물에 보여 id 3의 섹션 높이가 모바일 +30, 데스크톱 +32 늘어나고, 이전 건물 거래 제거로 거래 이력이 제목만 남는 id 3은 섹션 위쪽 y가 모바일 277, 데스크톱 270이 됨
// 2026-11-24 유사 건물 범례 항목 제거로 모바일 범례가 한 줄이 되어 id 2의 모바일 y가 26 줄어듦(1088 -> 1062)
// 2026-11-24 거래가 없는 id 3(망원하우스) 목업 제거로 id 3 상태 삭제
// secM과 secD는 캔버스 섹션 높이(모바일), 캔버스 높이에 카드 위아래 테두리 2를 더한 값(데스크톱). y는 캔버스 섹션 위쪽 좌표
export const C12_ID2_WOLSE: C12State = {
	id: 2,
	q: "?type=wolse",
	title: C12_NONE,
	secM: 378,
	secD: 413,
	yM: 1062,
	yD: 995,
	label: "id 2 월세",
};
export const C12_STATES: C12State[] = [
	{ id: 1, q: "", title: null, label: "id 1 전세" },
	{ id: 1, q: "?type=wolse", title: null, label: "id 1 월세" },
	{
		id: 2,
		q: "",
		title: C12_NONE,
		secM: 378,
		secD: 413,
		yM: 1062,
		yD: 995,
		label: "id 2 전세",
	},
	C12_ID2_WOLSE,
	{ id: 4, q: "", title: C12_NONE, label: "id 4 전세" },
	{ id: 4, q: "?type=wolse", title: C12_NONE, label: "id 4 월세" },
	{ id: 5, q: "", title: null, label: "id 5 전세" },
	{ id: 5, q: "?type=wolse", title: null, label: "id 5 월세" },
];
