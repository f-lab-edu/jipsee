import { describe, expect, it } from "vitest";
import { toChartLabel } from "@/pages/building/lib/toChartLabel";
import type { ChartPoint } from "@/pages/building/model/chartPoint";

const jeonse: ChartPoint = {
	dealId: 1,
	fromPreviousBuilding: false,
	dealType: "jeonse",
	xPercent: 0,
	yPercent: 0,
};
const sale: ChartPoint = { ...jeonse, dealId: 2, dealType: "sale" };

describe("toChartLabel", () => {
	it("전세와 매매 건수를 세어 문구를 만듦", () => {
		const points = [jeonse, jeonse, jeonse, jeonse, sale, sale];

		expect(toChartLabel(points, true)).toBe(
			"거래 금액 점 그래프, 전세 4건, 매매 2건",
		);
	});

	it("현재 건물 거래가 없으면 없다는 안내를 붙임", () => {
		expect(toChartLabel([jeonse], false)).toBe(
			"거래 금액 점 그래프, 전세 1건, 매매 0건, 현재 건물 거래 없음",
		);
	});
});
