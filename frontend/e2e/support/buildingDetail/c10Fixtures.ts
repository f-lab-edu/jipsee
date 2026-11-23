export type C10Name = "period" | "type";

export const C10_NAMES: C10Name[] = ["period", "type"];

export const C10_LABELS: Record<C10Name, string> = {
	period: "기간",
	type: "유형",
};

export const C10_OPTIONS: Record<C10Name, [string, number | string][]> = {
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

export type C10Cond = { period: number; type: string };

export const C10_DEFAULT: C10Cond = { period: 12, type: "jeonse" };

export const C10_AREA = "이 건물 거래 면적 ±10㎡로 고정돼요";

// 필터와 면적 고정 줄이 있는 건물
export const C10_FILTER_IDS = [1, 2, 3, 4, 5];

// 쿼리 처리(Review Focus 2): 항목 하나가 잘못되어도 그 항목만 기본값이고 나머지는 유지. 모르는 쿼리(옛 링크의 radius)는 무시
export const C10_QUERY_CASES: [string, string, Partial<C10Cond>][] = [
	["허용하지 않는 type(?type=sale)", "?type=sale", { type: "jeonse" }],
	[
		"허용하지 않는 type이고 나머지는 유효(?type=sale&period=6)",
		"?type=sale&period=6",
		{ period: 6, type: "jeonse" },
	],
	["앞에 0이 붙은 period(?period=06)", "?period=06", { period: 12 }],
	[
		"period=06이고 나머지는 유효(?period=06&type=wolse)",
		"?period=06&type=wolse",
		{ period: 12, type: "wolse" },
	],
	["빈 period(?period=)", "?period=", { period: 12 }],
	[
		"빈 period이고 나머지는 유효(?period=&type=wolse)",
		"?period=&type=wolse",
		{ period: 12, type: "wolse" },
	],
	["허용하지 않는 숫자(?period=7)", "?period=7", { period: 12 }],
	[
		"모두 유효(?period=6&type=wolse)",
		"?period=6&type=wolse",
		{ period: 6, type: "wolse" },
	],
	["옛 링크의 radius는 무시(?radius=300)", "?radius=300", {}],
	[
		"옛 링크의 radius를 두 번 주어도 무시(?radius=300&radius=1000&period=24&type=wolse)",
		"?radius=300&radius=1000&period=24&type=wolse",
		{ period: 24, type: "wolse" },
	],
];
