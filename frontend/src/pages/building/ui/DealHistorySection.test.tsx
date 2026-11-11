import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { BuildingDeal } from "@/entities/building/model/buildingDeal";
import type { BuildingDetail } from "@/entities/building/model/buildingDetail";
import DealHistorySection from "@/pages/building/ui/DealHistorySection";

const wolse: BuildingDeal = {
	id: 1,
	month: { year: 2026, month: 5 },
	type: "wolse",
	contract: "new",
	exclusiveArea: 40,
	amount: 3000,
	monthlyRent: 50,
	cancelled: false,
	similarBuilding: false,
};
const baseDetail: BuildingDetail = {
	id: 1,
	name: "망원빌라",
	address: "마포구 망원동 12-3",
	dongs: [],
	deals: [],
	previousDeals: [],
};
const rentDealBaseMonth = { year: 2026, month: 9 };

function renderSection(detail: BuildingDetail) {
	render(
		<DealHistorySection
			layout="mobile"
			detail={detail}
			rentDealBaseMonth={rentDealBaseMonth}
		/>,
	);
}

describe("DealHistorySection", () => {
	it("거래가 없으면 제목만 출력함", () => {
		renderSection(baseDetail);

		expect(screen.getByRole("heading", { name: "거래 이력" })).toBeTruthy();
		expect(screen.queryByRole("img")).toBeNull();
		expect(screen.queryByRole("list")).toBeNull();
		expect(
			screen.queryByRole("heading", { name: "이전 건물 거래" }),
		).toBeNull();
	});

	it("월세 거래만 있으면 그래프와 범례 없이 목록만 출력함", () => {
		renderSection({ ...baseDetail, deals: [wolse, { ...wolse, id: 2 }] });

		expect(screen.queryByRole("img")).toBeNull();
		expect(screen.queryByText("월세는 목록에서 확인해요")).toBeNull();
		expect(screen.getAllByRole("listitem")).toHaveLength(2);
	});

	it("현재 건물 거래가 없고 이전 건물 거래가 월세뿐이면 그래프 없이 이전 건물 목록을 출력함", () => {
		renderSection({ ...baseDetail, previousDeals: [wolse] });

		expect(screen.queryByRole("img")).toBeNull();
		expect(
			screen.getByRole("heading", { name: "이전 건물 거래" }),
		).toBeTruthy();
		expect(screen.getAllByRole("listitem")).toHaveLength(1);
	});
});
