import { describe, expect, it } from "vitest";
import { toHomeState } from "@/pages/home/lib/toHomeState";

const building = {
	id: 1,
	name: "망원 한강 아파트",
	address: "서울 마포구 망원동 1",
	useApprovalYear: 2010,
	latestNewJeonseMonth: null,
};

describe("toHomeState", () => {
	it("검색어가 비어 있으면 beforeSearch를 반환함", () => {
		expect(toHomeState("", null)).toBe("beforeSearch");
	});

	it("검색어가 2자 미만이면 queryTooShort를 반환함", () => {
		expect(toHomeState("망", { kind: "queryTooShort" })).toBe("queryTooShort");
	});

	it("건물이 1건 이상이면 found를 반환함", () => {
		expect(
			toHomeState("망원동", { kind: "found", buildings: [building] }),
		).toBe("found");
	});

	it("건물이 0건이면 noResult를 반환함", () => {
		expect(toHomeState("없는건물", { kind: "found", buildings: [] })).toBe(
			"noResult",
		);
	});
});
