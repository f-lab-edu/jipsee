import { describe, expect, it } from "vitest";
import type { BuildingDeal } from "@/entities/building/model/buildingDeal";
import { toChartMarkerKind } from "@/pages/building/lib/toChartMarkerKind";

const plainDeal: BuildingDeal = {
	id: "jeonse-1",
	month: { year: 2026, month: 8 },
	type: "jeonse",
	contract: "new",
	exclusiveArea: 42,
	amount: 25000,
	monthlyRent: null,
	cancelled: false,
};

describe("toChartMarkerKind", () => {
	it("해당하는 조건이 없으면 기본 종류를 반환함", () => {
		expect(toChartMarkerKind(plainDeal)).toBe("default");
	});

	it("계약이 갱신이면 갱신 종류를 반환함", () => {
		expect(toChartMarkerKind({ ...plainDeal, contract: "renewal" })).toBe(
			"renewal",
		);
	});

	it("해제되고 갱신인 거래는 해제 종류를 반환함", () => {
		expect(
			toChartMarkerKind({
				...plainDeal,
				cancelled: true,
				contract: "renewal",
			}),
		).toBe("cancelled");
	});
});
