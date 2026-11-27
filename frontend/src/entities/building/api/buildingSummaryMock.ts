import type { BuildingSummary } from "@/entities/building/model/buildingSummary";

const detailBuildings: BuildingSummary[] = [
	{
		id: "11440-망원동-12-3",
		name: "망원빌라",
		lotAddress: "마포구 망원동 12-3",
		latestNewJeonseMonth: { year: 2026, month: 8 },
	},
	{
		id: "11440-망원동-12-5",
		name: "망원빌라 2차",
		lotAddress: "마포구 망원동 12-5",
		latestNewJeonseMonth: { year: 2026, month: 6 },
	},
	{
		id: "11440-망원동-16-2",
		name: null,
		lotAddress: "마포구 망원동 16-2",
		latestNewJeonseMonth: { year: 2026, month: 3 },
	},
	{
		id: "11440-망원동-17-4",
		name: "망원맨션",
		lotAddress: "마포구 망원동 17-4",
		latestNewJeonseMonth: { year: 2026, month: 7 },
	},
];

// 페이지 나눔 확인용 건물. 번호는 상세 목업과 이어서 6부터 시작함. 7의 배수는 건물명이 없음
const pagingBuildings: BuildingSummary[] = Array.from(
	{ length: 43 },
	(_, index) => {
		const serial = index + 6;

		return {
			id: `11440-망원동-${30 + index}-1`,
			name: serial % 7 === 0 ? null : `망원마을 ${serial}호`,
			lotAddress: `마포구 망원동 ${30 + index}-1`,
			latestNewJeonseMonth:
				serial % 4 === 0 ? null : { year: 2026, month: (serial % 9) + 1 },
		};
	},
);

export const buildingSummaryMock: BuildingSummary[] = [
	...detailBuildings,
	...pagingBuildings,
];
