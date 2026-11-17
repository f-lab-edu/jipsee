import type { BuildingSummary } from "@/entities/building/model/buildingSummary";

const detailBuildings: BuildingSummary[] = [
	{
		id: 1,
		name: "망원빌라",
		lotAddress: "마포구 망원동 12-3",
		roadAddress: "마포구 월드컵로25길 12",
		useApprovalYear: 2003,
		latestNewJeonseMonth: { year: 2026, month: 8 },
	},
	{
		id: 2,
		name: "망원빌라 2차",
		lotAddress: "마포구 망원동 12-5",
		roadAddress: null,
		useApprovalYear: 2016,
		latestNewJeonseMonth: { year: 2026, month: 6 },
	},
	{
		id: 3,
		name: "망원하우스",
		lotAddress: "마포구 망원동 15-1",
		roadAddress: "마포구 월드컵로27길 30",
		useApprovalYear: 1998,
		latestNewJeonseMonth: null,
	},
	{
		id: 4,
		name: null,
		lotAddress: "마포구 망원동 16-2",
		roadAddress: "마포구 포은로8길 5",
		useApprovalYear: 2005,
		latestNewJeonseMonth: { year: 2026, month: 3 },
	},
	{
		id: 5,
		name: "망원맨션",
		lotAddress: "마포구 망원동 17-4",
		roadAddress: "마포구 포은로 12",
		useApprovalYear: null,
		latestNewJeonseMonth: { year: 2026, month: 7 },
	},
];

// 페이지 나눔 확인용 건물. 7의 배수는 건물명이 없고 5의 배수는 도로명 주소가 없음. 둘 다 없는 건물은 35
const pagingBuildings: BuildingSummary[] = Array.from(
	{ length: 43 },
	(_, index) => {
		const id = index + 6;

		return {
			id,
			name: id % 7 === 0 ? null : `망원마을 ${id}호`,
			lotAddress: `마포구 망원동 ${30 + index}-1`,
			roadAddress: id % 5 === 0 ? null : `마포구 월드컵로${id}길 ${index + 1}`,
			useApprovalYear: 1990 + (id % 30),
			latestNewJeonseMonth:
				id % 4 === 0 ? null : { year: 2026, month: (id % 9) + 1 },
		};
	},
);

export const buildingSummaryMock: BuildingSummary[] = [
	...detailBuildings,
	...pagingBuildings,
];
