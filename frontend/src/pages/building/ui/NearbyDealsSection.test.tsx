import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { NearbyDeal } from "@/entities/building/model/nearbyDeal";
import type { NearbyDealsResult } from "@/entities/building/model/nearbyDealsResult";
import NearbyDealsSection from "@/pages/building/ui/NearbyDealsSection";

const jeonse: NearbyDeal = {
	id: 1,
	type: "jeonse",
	buildingName: "한강빌라",
	month: { year: 2026, month: 7 },
	contract: "new",
	exclusiveArea: 40,
	amount: 24000,
	monthlyRent: null,
};
const condition = { radius: 500, period: 12, type: "jeonse" } as const;
const threeDeals = [jeonse, { ...jeonse, id: 2 }, { ...jeonse, id: 3 }];
const rentDealBaseMonth = { year: 2026, month: 9 };

function renderSection(
	layout: "mobile" | "desktop",
	result: NearbyDealsResult,
) {
	render(
		<NearbyDealsSection
			layout={layout}
			buildingId={1}
			condition={condition}
			result={result}
			rentDealBaseMonth={rentDealBaseMonth}
		/>,
	);
}

describe("NearbyDealsSection", () => {
	it("거래가 있으면 건수 줄과 모바일 목록 항목과 확정일자 안내를 출력함", () => {
		renderSection("mobile", {
			kind: "found",
			areaConditionApplied: false,
			deals: threeDeals,
		});

		expect(screen.getByText("3건")).toBeTruthy();
		expect(screen.getByText("을 찾았어요", { exact: false })).toBeTruthy();
		expect(
			screen.getByText(/확정일자를 기준으로 수집한 거래예요/),
		).toBeTruthy();
		expect(screen.getByText("2026.09 기준")).toBeTruthy();
		expect(screen.getAllByRole("listitem")).toHaveLength(3);
		expect(screen.getAllByRole("note")).toHaveLength(1);
	});

	it("거래가 기준보다 적으면 건수 줄 아래에 조건 확장 안내를 출력함", () => {
		renderSection("mobile", {
			kind: "found",
			areaConditionApplied: false,
			deals: [jeonse, { ...jeonse, id: 2 }],
		});

		const notes = screen.getAllByRole("note");

		expect(notes).toHaveLength(2);
		expect(within(notes[0]).getByText("조건에 맞는 거래 2건")).toBeTruthy();
		expect(
			within(notes[0]).getByText("반경이나 기간을 넓혀 보세요"),
		).toBeTruthy();
		expect(screen.getAllByRole("listitem")).toHaveLength(2);
	});

	it("거래가 있으면 데스크톱에서 머리 행과 거래 행을 가진 표를 출력함", () => {
		renderSection("desktop", {
			kind: "found",
			areaConditionApplied: false,
			deals: threeDeals,
		});

		const table = screen.getByRole("table", { name: "주변 전월세 거래" });

		expect(within(table).getAllByRole("columnheader")).toHaveLength(5);
		expect(within(table).getAllByRole("row")).toHaveLength(4);
	});

	it("거래가 0건이어도 건수 줄과 확정일자 안내를 출력하고 목록은 출력하지 않음", () => {
		renderSection("mobile", {
			kind: "found",
			areaConditionApplied: true,
			deals: [],
		});

		expect(screen.getByText("0건")).toBeTruthy();
		expect(screen.getAllByRole("note")).toHaveLength(2);
		expect(screen.getByText("조건에 맞는 거래가 없어요")).toBeTruthy();
		expect(screen.queryByRole("list")).toBeNull();
	});

	it("위치 정보가 없으면 건수 줄과 목록과 확정일자 안내를 출력하지 않음", () => {
		renderSection("mobile", { kind: "noLocation" });

		expect(screen.queryByText(/건$/)).toBeNull();
		expect(screen.queryByText("2026.09 기준")).toBeNull();
		expect(screen.queryByRole("listitem")).toBeNull();
		expect(screen.getAllByRole("note")).toHaveLength(1);
		expect(
			screen.queryByText(/확정일자를 기준으로 수집한 거래예요/),
		).toBeNull();
	});
});
