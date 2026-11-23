import { describe, expect, it } from "vitest";
import type { BuildingDeal } from "@/entities/building/model/buildingDeal";
import { toChartDeals } from "@/pages/building/lib/toChartDeals";

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
const wolse: BuildingDeal = { ...jeonse, id: 2, type: "wolse" };
const sale: BuildingDeal = { ...jeonse, id: 3, type: "sale" };

describe("toChartDeals", () => {
	it("월세 거래를 뺌", () => {
		const chartDeals = toChartDeals([jeonse, wolse, sale]);

		expect(chartDeals.map(({ deal }) => deal.id)).toEqual([1, 3]);
	});

	it("거래 유형을 그대로 담음", () => {
		const chartDeals = toChartDeals([jeonse, sale]);

		expect(chartDeals.map(({ dealType }) => dealType)).toEqual([
			"jeonse",
			"sale",
		]);
	});
});
