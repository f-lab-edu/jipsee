import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { BuildingDeal } from "@/entities/building/model/buildingDeal";
import DealChart from "@/pages/building/ui/DealChart";

const jeonse: BuildingDeal = {
	id: 1,
	month: { year: 2026, month: 8 },
	type: "jeonse",
	contract: "new",
	exclusiveArea: 42,
	amount: 25000,
	monthlyRent: null,
	cancelled: false,
	similarBuilding: false,
};
const wolse: BuildingDeal = {
	...jeonse,
	id: 2,
	type: "wolse",
	amount: 3000,
	monthlyRent: 50,
};

describe("DealChart", () => {
	it("월세 거래만 있으면 그래프를 출력하지 않음", () => {
		render(
			<DealChart
				layout="mobile"
				deals={[wolse]}
				previousDeals={[]}
				endYear={2026}
			/>,
		);

		expect(screen.queryByRole("img")).toBeNull();
	});

	it("전세 거래가 있으면 읽기 문구가 있는 그래프를 하나 출력함", () => {
		render(
			<DealChart
				layout="mobile"
				deals={[jeonse, wolse]}
				previousDeals={[]}
				endYear={2026}
			/>,
		);

		expect(screen.getAllByRole("img")).toHaveLength(1);
		expect(screen.getByRole("img").getAttribute("aria-label")).toBe(
			"거래 금액 점 그래프, 전세 1건, 매매 0건",
		);
	});
});
