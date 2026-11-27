import { describe, expect, it } from "vitest";
import { toChartLabel } from "@/pages/building/lib/toChartLabel";
import type { ChartPoint } from "@/pages/building/model/chartPoint";

const jeonse: ChartPoint = {
	dealId: "jeonse-1",
	dealType: "jeonse",
	markerKind: "default",
	xPercent: 0,
	yPercent: 0,
};
const sale: ChartPoint = { ...jeonse, dealId: "sale-2", dealType: "sale" };

describe("toChartLabel", () => {
	it("전세와 매매 건수를 세어 문구를 만듦", () => {
		const points = [jeonse, jeonse, jeonse, jeonse, sale, sale];

		expect(toChartLabel(points)).toBe(
			"거래 금액 점 그래프, 전세 4건, 매매 2건",
		);
	});
});
