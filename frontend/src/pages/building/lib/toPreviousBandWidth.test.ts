import { describe, expect, it } from "vitest";
import type { BuildingDeal } from "@/entities/building/model/buildingDeal";
import { toChartAxis } from "@/pages/building/lib/toChartAxis";
import { toChartDeals } from "@/pages/building/lib/toChartDeals";
import { toPreviousBandWidth } from "@/pages/building/lib/toPreviousBandWidth";

const previousJeonse: BuildingDeal = {
	id: 1,
	month: { year: 2012, month: 3 },
	type: "jeonse",
	contract: "new",
	exclusiveArea: 50,
	amount: 9000,
	monthlyRent: null,
	cancelled: false,
	similarBuilding: false,
};
const previousWolse: BuildingDeal = {
	...previousJeonse,
	id: 2,
	month: { year: 2013, month: 3 },
	type: "wolse",
	monthlyRent: 30,
};
const currentJeonse: BuildingDeal = {
	...previousJeonse,
	id: 3,
	month: { year: 2012, month: 7 },
};

function toWidth(deals: BuildingDeal[], previousDeals: BuildingDeal[]) {
	const axis = toChartAxis(toChartDeals(deals, previousDeals), 2026);

	if (axis === null) {
		return null;
	}

	return toPreviousBandWidth(deals, previousDeals, axis);
}

describe("toPreviousBandWidth", () => {
	it("이전 건물 거래가 없으면 null을 반환함", () => {
		expect(toWidth([currentJeonse], [])).toBeNull();
	});

	it("현재 건물 거래가 없으면 마지막 이전 건물 거래 위치에 12를 더한 값으로 제한함", () => {
		expect(toWidth([], [previousJeonse])).toBe(13.12);
	});

	it("현재 건물의 가장 오래된 거래가 가까우면 두 위치의 평균을 반환함", () => {
		expect(toWidth([currentJeonse], [previousJeonse])).toBe(2.23);
	});

	it("이전 건물의 월세 거래도 마지막 위치 계산에 포함함", () => {
		expect(toWidth([], [previousJeonse, previousWolse])).toBe(19.82);
	});
});
