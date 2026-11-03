import { describe, expect, it } from "vitest";
import { toBuildingDetail } from "@/entities/building/lib/toBuildingDetail";
import type { BuildingSummary } from "@/entities/building/model/buildingSummary";

const building: BuildingSummary = {
	id: 1,
	name: "망원빌라",
	address: "마포구 망원동 12-3",
	useApprovalYear: 2016,
	latestNewJeonseMonth: { year: 2026, month: 6 },
};

describe("toBuildingDetail", () => {
	it("사용승인 연도와 최근 신규 전세 월이 있으면 둘 다 표시함", () => {
		expect(toBuildingDetail(building)).toBe(
			"2016년 사용승인, 최근 신규 전세 2026.06",
		);
	});

	it("사용승인 연도가 없으면 전세 정보만 표시함", () => {
		expect(toBuildingDetail({ ...building, useApprovalYear: null })).toBe(
			"최근 신규 전세 2026.06",
		);
	});

	it("최근 신규 전세 월이 없으면 12개월 신규 전세 없음으로 표시함", () => {
		expect(toBuildingDetail({ ...building, latestNewJeonseMonth: null })).toBe(
			"2016년 사용승인, 최근 12개월 신규 전세 없음",
		);
	});
});
