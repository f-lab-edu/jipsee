import { describe, expect, it } from "vitest";
import { buildingDetailMock } from "@/entities/building/api/buildingDetailMock";
import type { BuildingDeal } from "@/entities/building/model/buildingDeal";
import { toChartAxis } from "@/pages/building/lib/toChartAxis";
import { toChartDeals } from "@/pages/building/lib/toChartDeals";

const defaultBuilding = buildingDetailMock[0];
const fewDealsBuilding = buildingDetailMock[2];

const baseDeal: BuildingDeal = {
	id: 1,
	month: { year: 2026, month: 1 },
	type: "jeonse",
	contract: "new",
	exclusiveArea: 42,
	amount: 25000,
	monthlyRent: null,
	cancelled: false,
	similarBuilding: false,
};

function toYearWidthDeals(startYear: number): BuildingDeal[] {
	return [{ ...baseDeal, month: { year: startYear, month: 1 } }];
}

describe("toChartAxis", () => {
	it("기본 건물의 축을 계산함", () => {
		const axis = toChartAxis(
			toChartDeals(defaultBuilding.deals, defaultBuilding.previousDeals),
			2026,
		);

		expect(axis?.yMin).toBe(20000);
		expect(axis?.yMax).toBe(32000);
		expect(axis?.yLabels).toEqual([32000, 26000, 20000]);
		expect(axis?.startYear).toBe(2023);
		expect(axis?.total).toBe(47);
		expect(axis?.xTicks.map(({ year }) => year)).toEqual([
			2023, 2024, 2025, 2026,
		]);
	});

	it("거래 적음 건물의 축을 계산함", () => {
		const axis = toChartAxis(
			toChartDeals(fewDealsBuilding.deals, fewDealsBuilding.previousDeals),
			2026,
		);

		expect(axis?.yMin).toBe(8000);
		expect(axis?.yMax).toBe(10000);
		expect(axis?.startYear).toBe(2012);
		expect(axis?.xTicks.map(({ year }) => year)).toEqual([
			2012, 2015, 2018, 2021, 2024,
		]);
	});

	it("눈금 위치는 눈금 연도 1월의 비율임", () => {
		const axis = toChartAxis(
			toChartDeals(defaultBuilding.deals, defaultBuilding.previousDeals),
			2026,
		);

		expect(axis?.xTicks[0]?.xPercent).toBe(0);
		expect(axis?.xTicks[1]?.xPercent).toBeCloseTo((12 / 47) * 100, 5);
	});

	it("점을 그릴 거래가 없으면 null을 반환함", () => {
		expect(toChartAxis([], 2026)).toBeNull();
	});

	it("연도 폭이 5 이하이면 1년 간격으로 눈금을 둠", () => {
		const axis = toChartAxis(toChartDeals(toYearWidthDeals(2022), []), 2026);

		expect(axis?.xTicks.map(({ year }) => year)).toEqual([
			2022, 2023, 2024, 2025, 2026,
		]);
	});

	it("연도 폭이 6 이상 10 이하이면 2년 간격으로 눈금을 둠", () => {
		const sixYears = toChartAxis(
			toChartDeals(toYearWidthDeals(2021), []),
			2026,
		);
		const tenYears = toChartAxis(
			toChartDeals(toYearWidthDeals(2017), []),
			2026,
		);

		expect(sixYears?.xTicks.map(({ year }) => year)).toEqual([
			2021, 2023, 2025,
		]);
		expect(tenYears?.xTicks.map(({ year }) => year)).toEqual([
			2017, 2019, 2021, 2023, 2025,
		]);
	});

	it("연도 폭이 11 이상이면 3년 간격으로 눈금을 둠", () => {
		const axis = toChartAxis(toChartDeals(toYearWidthDeals(2016), []), 2026);

		expect(axis?.xTicks.map(({ year }) => year)).toEqual([
			2016, 2019, 2022, 2025,
		]);
	});
});
