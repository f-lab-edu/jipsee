import { describe, expect, it } from "vitest";
import type { BuildingDeal } from "@/entities/building/model/buildingDeal";
import { toChartMarkerKind } from "@/pages/building/lib/toChartMarkerKind";

const plainDeal: BuildingDeal = {
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

describe("toChartMarkerKind", () => {
	it("해당하는 조건이 없으면 기본 종류를 반환함", () => {
		expect(toChartMarkerKind(plainDeal, false)).toBe("default");
	});

	it("계약이 갱신이면 갱신 종류를 반환함", () => {
		expect(
			toChartMarkerKind({ ...plainDeal, contract: "renewal" }, false),
		).toBe("renewal");
	});

	it("이전 건물 거래이면서 해제된 거래는 이전 건물 종류를 반환함", () => {
		expect(toChartMarkerKind({ ...plainDeal, cancelled: true }, true)).toBe(
			"previous",
		);
	});

	it("해제되고 유사 건물인 거래는 해제 종류를 반환함", () => {
		expect(
			toChartMarkerKind(
				{ ...plainDeal, cancelled: true, similarBuilding: true },
				false,
			),
		).toBe("cancelled");
	});

	it("유사 건물이면서 갱신인 거래는 유사 건물 종류를 반환함", () => {
		expect(
			toChartMarkerKind(
				{ ...plainDeal, similarBuilding: true, contract: "renewal" },
				false,
			),
		).toBe("similar");
	});
});
