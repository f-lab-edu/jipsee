// 캔버스 보드 S2의 점 그래프 기대 데이터. 점 색, 건물별 거래, 건물 id별 데이터 묶음

export type ChartDeal = {
	y: number;
	m: number;
	kind: "jeonse" | "sale";
	amt: number;
	prev?: boolean;
};

export const C8_COLORS = {
	light: {
		jeonse: "rgb(33, 124, 249)",
		sale: "rgb(155, 120, 33)",
		previous: "rgb(134, 139, 148)",
	},
	dark: {
		jeonse: "rgb(30, 130, 235)",
		sale: "rgb(202, 144, 28)",
		previous: "rgb(176, 179, 186)",
	},
};

export const C8_DEALS: Record<string, ChartDeal[]> = {
	default: [
		{ y: 2026, m: 8, kind: "jeonse", amt: 25000 },
		{ y: 2025, m: 11, kind: "sale", amt: 31000 },
		{ y: 2025, m: 6, kind: "jeonse", amt: 24000 },
		{ y: 2024, m: 9, kind: "jeonse", amt: 23000 },
		{ y: 2024, m: 2, kind: "sale", amt: 30500 },
		{ y: 2023, m: 7, kind: "jeonse", amt: 22000 },
	],
	noloc: [
		{ y: 2026, m: 3, kind: "jeonse", amt: 18000 },
		{ y: 2024, m: 10, kind: "jeonse", amt: 17000 },
		{ y: 2023, m: 5, kind: "jeonse", amt: 16000 },
	],
	few: [{ y: 2012, m: 3, kind: "jeonse", amt: 9000, prev: true }],
};

export const C8_SET: Record<number, string> = {
	1: "default",
	2: "default",
	3: "few",
	4: "noloc",
	5: "default",
};

export const C8_ID_LIST = [1, 4, 3];
