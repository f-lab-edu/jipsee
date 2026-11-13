import { describe, expect, it } from "vitest";
import { toDataSourceCards } from "@/entities/dataSource/lib/toDataSourceCards";

describe("toDataSourceCards", () => {
	it("숨김 출처는 응답에 행이 와도 카드로 만들지 않음", () => {
		const cards = toDataSourceCards([
			{ source: "RENT_DEAL", baseMonth: { year: 2026, month: 9 } },
			{ source: "LAW", baseMonth: { year: 2026, month: 9 } },
		]);

		expect(cards.map((card) => card.source)).not.toContain("LAW");
	});

	it("응답에 행이 없는 출처는 기준 월 없이 카드로 만듦", () => {
		const cards = toDataSourceCards([
			{ source: "RENT_DEAL", baseMonth: { year: 2026, month: 9 } },
		]);

		expect(
			cards.find((card) => card.source === "RENT_DEAL")?.baseMonth,
		).toEqual({ year: 2026, month: 9 });
		expect(
			cards.find((card) => card.source === "SALE_DEAL")?.baseMonth,
		).toBeNull();
	});

	it("고정 값에 없는 출처의 행은 카드로 만들지 않음", () => {
		const cards = toDataSourceCards([
			{ source: "UNKNOWN", baseMonth: { year: 2026, month: 9 } },
		]);

		expect(cards.map((card) => card.source)).toEqual([
			"RENT_DEAL",
			"SALE_DEAL",
			"BUILDING_REGISTER",
		]);
	});
});
