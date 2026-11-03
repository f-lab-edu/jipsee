import type { BuildingSummary } from "@/entities/building/model/buildingSummary";

export const buildingSummaryMock: BuildingSummary[] = [
	{
		id: 1,
		name: "망원빌라",
		address: "마포구 망원동 12-3",
		useApprovalYear: 2003,
		latestNewJeonseMonth: { year: 2026, month: 8 },
	},
	{
		id: 2,
		name: "망원빌라 2차",
		address: "마포구 망원동 12-5",
		useApprovalYear: 2016,
		latestNewJeonseMonth: { year: 2026, month: 6 },
	},
	{
		id: 3,
		name: "망원하우스",
		address: "마포구 망원동 15-1",
		useApprovalYear: 1998,
		latestNewJeonseMonth: null,
	},
	{
		id: 4,
		name: null,
		address: "마포구 망원동 16-2",
		useApprovalYear: 2005,
		latestNewJeonseMonth: { year: 2026, month: 3 },
	},
	{
		id: 5,
		name: "망원맨션",
		address: "마포구 망원동 17-4",
		useApprovalYear: null,
		latestNewJeonseMonth: { year: 2026, month: 7 },
	},
];
