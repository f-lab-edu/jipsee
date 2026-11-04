import { describe, expect, it } from "vitest";
import { toSearchState } from "@/pages/search/lib/toSearchState";

const building = {
	id: 1,
	name: "망원 한강 아파트",
	address: "서울 마포구 망원동 1",
	useApprovalYear: 2010,
	latestNewJeonseMonth: null,
};

describe("toSearchState", () => {
	it("검색어가 2자 미만이면 queryTooShort를 반환함", () => {
		expect(toSearchState({ kind: "queryTooShort" })).toBe("queryTooShort");
	});

	it("건물이 1건 이상이면 found를 반환함", () => {
		expect(toSearchState({ kind: "found", buildings: [building] })).toBe(
			"found",
		);
	});

	it("건물이 0건이면 noResult를 반환함", () => {
		expect(toSearchState({ kind: "found", buildings: [] })).toBe("noResult");
	});
});
