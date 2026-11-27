import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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
			expect(result.buildings).toHaveLength(7);
			expect(result.hasNext).toBe(false);
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

	describe("API_URL이 있으면", () => {
		const fetchMock = vi.fn();
		const buildings = [
			{
				id: "11440-망원동-12-3",
				name: "망원빌라",
				lotAddress: "마포구 망원동 12-3",
				latestNewJeonseMonth: { year: 2026, month: 8 },
			},
			{
				id: "11440-망원동-16-2",
				name: null,
				lotAddress: "마포구 망원동 16-2",
				latestNewJeonseMonth: null,
			},
		];

		beforeEach(() => {
			vi.stubEnv("API_URL", "http://backend.test/");
			fetchMock.mockReset();
			vi.stubGlobal("fetch", fetchMock);
		});

		afterEach(() => {
			vi.unstubAllEnvs();
			vi.unstubAllGlobals();
		});

		it("검색어와 페이지를 쿼리로 백엔드를 조회하고 data 필드를 found로 반환함", async () => {
			fetchMock.mockResolvedValue(
				Response.json({ data: { buildings, hasNext: true } }),
			);

			const result = await searchBuildings("망원동 12", 1);

			expect(fetchMock.mock.calls[0][0]).toBe(
				`http://backend.test/buildings?keyword=${encodeURIComponent("망원동 12")}&page=1`,
			);
			expect(result).toEqual({ kind: "found", buildings, hasNext: true });
		});

		it("검색어가 2자 미만이면 백엔드를 호출하지 않고 queryTooShort를 반환함", async () => {
			expect(await searchBuildings("망")).toEqual({ kind: "queryTooShort" });
			expect(fetchMock).not.toHaveBeenCalled();
		});

		it("400 KEYWORD_TOO_SHORT이면 queryTooShort를 반환함", async () => {
			fetchMock.mockResolvedValue(
				Response.json({ code: "KEYWORD_TOO_SHORT" }, { status: 400 }),
			);

			expect(await searchBuildings("망원동")).toEqual({
				kind: "queryTooShort",
			});
		});

		it("429이면 본문과 상관없이 rateLimited를 반환함", async () => {
			fetchMock.mockResolvedValue(
				new Response("Too Many Requests", { status: 429 }),
			);

			expect(await searchBuildings("망원동")).toEqual({ kind: "rateLimited" });
		});

		it.each([
			[
				"400 INVALID_REQUEST",
				Response.json({ code: "INVALID_REQUEST" }, { status: 400 }),
			],
			["500", Response.json({}, { status: 500 })],
			["404", Response.json({}, { status: 404 })],
		])("%s이면 failed를 반환함", async (_label, response) => {
			fetchMock.mockResolvedValue(response);

			expect(await searchBuildings("망원동")).toEqual({ kind: "failed" });
		});

		it("호출에 실패하면 failed를 반환함", async () => {
			fetchMock.mockRejectedValue(new Error("network"));

			expect(await searchBuildings("망원동")).toEqual({ kind: "failed" });
		});

		it("목업 실패 스위치를 따르지 않음", async () => {
			failure.value = "searchFailed";
			fetchMock.mockResolvedValue(
				Response.json({ data: { buildings: [], hasNext: false } }),
			);

			expect((await searchBuildings("망원동")).kind).toBe("found");
		});
	});
});
