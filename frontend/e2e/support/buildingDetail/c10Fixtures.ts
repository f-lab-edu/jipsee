export const C10_TOKENS = {
	light: {
		neutralWeak: "#f3f4f5",
		neutralSolid: "#2a3038",
		onNeutralSolid: "#ffffff",
	},
	dark: {
		neutralWeak: "#2b2e35",
		neutralSolid: "#f3f4f5",
		onNeutralSolid: "#16171b",
	},
};

export type C10Name = "radius" | "period" | "type";

export const C10_NAMES: C10Name[] = ["radius", "period", "type"];

export const C10_LABELS: Record<C10Name, string> = {
	radius: "반경",
	period: "기간",
	type: "유형",
};

export const C10_CHIPS: Record<C10Name, [string, number | string][]> = {
	radius: [
		["300m", 300],
		["500m", 500],
		["1km", 1000],
	],
	period: [
		["6개월", 6],
		["12개월", 12],
		["24개월", 24],
	],
	type: [
		["전세", "jeonse"],
		["월세", "wolse"],
	],
};

export type C10Cond = { radius: number; period: number; type: string };

export const C10_DEFAULT: C10Cond = { radius: 500, period: 12, type: "jeonse" };

export const C10_AREA = "이 건물 거래 면적 ±10㎡로 고정돼요";

// 필터가 있는 건물(id 4는 위치 정보가 없어 필터 자체가 없음)과 면적 고정 줄이 있는 건물(id 3은 현재 건물 거래가 없음)
export const C10_FILTER_IDS = [1, 2, 3, 5];
export const C10_AREA_IDS = [1, 2, 5];

// 쿼리 처리(Review Focus 2): 항목 하나가 잘못되어도 그 항목만 기본값이고 나머지는 유지
export const C10_QUERY_CASES: [string, string, Partial<C10Cond>][] = [
	[
		"radius를 두 번(?radius=300&radius=1000)",
		"?radius=300&radius=1000",
		{ radius: 500 },
	],
	[
		"radius를 두 번 주고 나머지는 유효(?radius=300&radius=1000&period=24&type=wolse)",
		"?radius=300&radius=1000&period=24&type=wolse",
		{ radius: 500, period: 24, type: "wolse" },
	],
	["허용하지 않는 type(?type=sale)", "?type=sale", { type: "jeonse" }],
	[
		"허용하지 않는 type이고 나머지는 유효(?type=sale&radius=1000&period=6)",
		"?type=sale&radius=1000&period=6",
		{ radius: 1000, period: 6, type: "jeonse" },
	],
	["앞에 0이 붙은 period(?period=06)", "?period=06", { period: 12 }],
	[
		"period=06이고 나머지는 유효(?period=06&radius=300&type=wolse)",
		"?period=06&radius=300&type=wolse",
		{ radius: 300, period: 12, type: "wolse" },
	],
	["빈 period(?period=)", "?period=", { period: 12 }],
	[
		"빈 period이고 나머지는 유효(?period=&radius=1000&type=wolse)",
		"?period=&radius=1000&type=wolse",
		{ radius: 1000, period: 12, type: "wolse" },
	],
	[
		"숫자가 아닌 radius와 앞에 0이 붙은 period(?radius=abc&period=06)",
		"?radius=abc&period=06",
		{ radius: 500, period: 12 },
	],
	[
		"허용하지 않는 숫자(?radius=700&period=24)",
		"?radius=700&period=24",
		{ radius: 500, period: 24 },
	],
	[
		"모두 유효(?radius=1000&period=6&type=wolse)",
		"?radius=1000&period=6&type=wolse",
		{ radius: 1000, period: 6, type: "wolse" },
	],
];
