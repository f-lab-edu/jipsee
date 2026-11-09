import type { DealExpectation } from "./dealExpectation";

/** 캔버스 보드 B.default.deals. id 1, 2, 5는 같은 값임 */
export const DEALS_DEFAULT: DealExpectation[] = [
	{
		date: "2026.08",
		type: "신규 전세",
		kind: "jeonse",
		area: "42㎡",
		amount: "2억 5,000만원",
	},
	{
		date: "2026.05",
		type: "신규 월세",
		kind: "wolse",
		area: "40㎡",
		amount: "보증금 3,000만원 / 월 50만원",
	},
	{
		date: "2025.11",
		type: "매매",
		kind: "sale",
		cancelled: true,
		area: "42㎡",
		amount: "3억 1,000만원",
	},
	{
		date: "2025.06",
		type: "갱신 전세",
		kind: "jeonse",
		area: "42㎡",
		amount: "2억 4,000만원",
	},
	{
		date: "2024.09",
		type: "신규 전세",
		kind: "jeonse",
		similar: true,
		area: "40㎡",
		amount: "2억 3,000만원",
	},
	{
		date: "2024.02",
		type: "매매",
		kind: "sale",
		area: "42㎡",
		amount: "3억 500만원",
	},
	{
		date: "2023.07",
		type: "신규 전세",
		kind: "jeonse",
		area: "42㎡",
		amount: "2억 2,000만원",
	},
];

/** 캔버스 보드 B.noloc.deals */
export const DEALS_NOLOC: DealExpectation[] = [
	{
		date: "2026.03",
		type: "신규 전세",
		kind: "jeonse",
		area: "33㎡",
		amount: "1억 8,000만원",
	},
	{
		date: "2024.10",
		type: "갱신 전세",
		kind: "jeonse",
		area: "33㎡",
		amount: "1억 7,000만원",
	},
	{
		date: "2023.05",
		type: "신규 전세",
		kind: "jeonse",
		area: "33㎡",
		amount: "1억 6,000만원",
	},
];

/** 건물 id별 현재 건물 거래. id 3은 현재 건물 거래가 없음 */
export const DEALS: Record<number, DealExpectation[]> = {
	1: DEALS_DEFAULT,
	2: DEALS_DEFAULT,
	3: [],
	4: DEALS_NOLOC,
	5: DEALS_DEFAULT,
};
