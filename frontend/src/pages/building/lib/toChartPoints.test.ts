import { describe, expect, it } from "vitest";
import { buildingDetailMock } from "@/entities/building/api/buildingDetailMock";
import type { BuildingDetail } from "@/entities/building/model/buildingDetail";
import { toChartAxis } from "@/pages/building/lib/toChartAxis";
import { toChartDeals } from "@/pages/building/lib/toChartDeals";
import { toChartPoints } from "@/pages/building/lib/toChartPoints";

const defaultBuilding = buildingDetailMock[0];

function toPoints(building: BuildingDetail) {
	const chartDeals = toChartDeals(building.deals);
	const axis = toChartAxis(chartDeals, 2026);

	if (axis === null) {
		return [];
	}

	return toChartPoints(chartDeals, axis);
}

describe("toChartPoints", () => {
	it("기본 건물은 월세를 뺀 점 여섯 개를 만듦", () => {
		expect(toPoints(defaultBuilding)).toHaveLength(6);
	});

	it("기본 건물의 점 위치가 캔버스 계산과 같음", () => {
		const points = toPoints(defaultBuilding);
		const latestJeonse = points.find(({ dealId }) => dealId === "jeonse-1");
		const oldestJeonse = points.find(({ dealId }) => dealId === "jeonse-7");
		const sale = points.find(({ dealId }) => dealId === "sale-3");

		expect(latestJeonse?.xPercent).toBeCloseTo(91.49, 2);
		expect(latestJeonse?.yPercent).toBeCloseTo(58.33, 2);
		expect(oldestJeonse?.xPercent).toBeCloseTo(12.77, 2);
		expect(oldestJeonse?.yPercent).toBeCloseTo(83.33, 2);
		expect(sale?.xPercent).toBeCloseTo(72.34, 2);
		expect(sale?.yPercent).toBeCloseTo(8.33, 2);
	});

	it("거래 상태에 맞는 마커 종류를 채움", () => {
		const kinds = toPoints(defaultBuilding).map(
			({ dealType, dealId, markerKind }) => [dealType, dealId, markerKind],
		);

		expect(kinds).toContainEqual(["jeonse", "jeonse-1", "default"]);
		expect(kinds).toContainEqual(["sale", "sale-3", "cancelled"]);
		expect(kinds).toContainEqual(["jeonse", "jeonse-4", "renewal"]);
		expect(kinds).toContainEqual(["jeonse", "jeonse-5", "default"]);
	});

	it("월세 거래만 있으면 점이 없음", () => {
		const wolseOnly: BuildingDetail = {
			...defaultBuilding,
			deals: defaultBuilding.deals.filter(({ type }) => type === "wolse"),
		};

		expect(toPoints(wolseOnly)).toEqual([]);
	});
});
