import { beforeEach, describe, expect, it, vi } from "vitest";
import { searchBuildings } from "@/entities/building/api/searchBuildings";

const failure = vi.hoisted(() => ({ value: "none" }));

vi.mock("@/entities/building/api/readBuildingMockFailure", () => ({
	readBuildingMockFailure: async () => failure.value,
}));

describe("searchBuildings", () => {
	beforeEach(() => {
		failure.value = "none";
	});

	it("검색어가 2자 미만이면 queryTooShort를 반환함", async () => {
		expect(await searchBuildings("망")).toEqual({ kind: "queryTooShort" });
	});

	it("0번 페이지는 20건과 다음 페이지가 있음을 반환함", async () => {
		const result = await searchBuildings("망원동", 0);

		expect(result.kind).toBe("found");
		if (result.kind === "found") {
			expect(result.buildings).toHaveLength(20);
			expect(result.hasNext).toBe(true);
		}
	});

	it("마지막 페이지는 남은 건물만 반환하고 hasNext가 false임", async () => {
		const result = await searchBuildings("망원동", 2);

		expect(result.kind).toBe("found");
		if (result.kind === "found") {
			expect(result.buildings).toHaveLength(8);
			expect(result.hasNext).toBe(false);
		}
	});

	it("도로명 주소로도 검색함", async () => {
		const result = await searchBuildings("월드컵로25길", 0);

		expect(result.kind).toBe("found");
		if (result.kind === "found") {
			expect(result.buildings.map((building) => building.id)).toContain(1);
		}
	});

	it("범위를 넘는 페이지는 빈 목록과 hasNext false를 반환함", async () => {
		expect(await searchBuildings("망원동", 9)).toEqual({
			kind: "found",
			buildings: [],
			hasNext: false,
		});
	});

	it("요청 제한 목업이면 rateLimited를 반환함", async () => {
		failure.value = "searchRateLimited";

		expect(await searchBuildings("망원동")).toEqual({ kind: "rateLimited" });
	});

	it("호출 실패 목업이면 failed를 반환함", async () => {
		failure.value = "searchFailed";

		expect(await searchBuildings("망원동")).toEqual({ kind: "failed" });
	});

	it("검색어가 2자 미만이면 실패 목업이어도 queryTooShort를 반환함", async () => {
		failure.value = "searchFailed";

		expect(await searchBuildings("망")).toEqual({ kind: "queryTooShort" });
	});
});
