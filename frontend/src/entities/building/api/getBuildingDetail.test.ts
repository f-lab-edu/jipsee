import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getBuildingDetail } from "@/entities/building/api/getBuildingDetail";

const failure = vi.hoisted(() => ({ value: "none" }));

vi.mock("@/entities/building/api/readBuildingMockFailure", () => ({
	readBuildingMockFailure: async () => failure.value,
}));

describe("getBuildingDetail", () => {
	beforeEach(() => {
		failure.value = "none";
		vi.stubEnv("API_URL", "");
	});

	afterEach(() => {
		vi.unstubAllEnvs();
		vi.unstubAllGlobals();
	});

	it("목업에 있는 id를 조회하면 found와 그 id의 상세를 반환함", async () => {
		const result = await getBuildingDetail("11440-망원동-12-3");

		expect(result.kind).toBe("found");
		expect(result.kind === "found" && result.detail.id).toBe(
			"11440-망원동-12-3",
		);
	});

	it("목업에 없는 id를 조회하면 notFound를 반환함", async () => {
		expect(await getBuildingDetail("11440-망원동-999-9")).toEqual({
			kind: "notFound",
		});
	});

	it("요청 제한 목업이면 rateLimited를 반환함", async () => {
		failure.value = "buildingRateLimited";

		expect(await getBuildingDetail("11440-망원동-12-3")).toEqual({
			kind: "rateLimited",
		});
	});

	it("호출 실패 목업이면 오류를 던짐", async () => {
		failure.value = "buildingFailed";

		await expect(getBuildingDetail("11440-망원동-12-5")).rejects.toThrow();
	});

	describe("API_URL이 있으면", () => {
		const fetchMock = vi.fn();

		beforeEach(() => {
			vi.stubEnv("API_URL", "http://backend.test/");
			fetchMock.mockReset();
			vi.stubGlobal("fetch", fetchMock);
		});

		it("백엔드 경로를 조회하고 data 필드를 found의 상세로 반환함", async () => {
			fetchMock.mockResolvedValue(
				Response.json({
					data: {
						id: "11440-망원동-519",
						name: null,
						address: "마포구 망원동 519",
						deals: [],
					},
				}),
			);

			const result = await getBuildingDetail("11440-망원동-519");

			expect(fetchMock.mock.calls[0][0]).toBe(
				`http://backend.test/buildings/${encodeURIComponent("11440-망원동-519")}`,
			);
			expect(result).toEqual({
				kind: "found",
				detail: {
					id: "11440-망원동-519",
					name: null,
					address: "마포구 망원동 519",
					deals: [],
				},
			});
		});

		it("404 BUILDING_NOT_FOUND이면 notFound를 반환함", async () => {
			fetchMock.mockResolvedValue(
				Response.json(
					{ code: "BUILDING_NOT_FOUND" },
					{
						status: 404,
						headers: { "content-type": "application/problem+json" },
					},
				),
			);

			expect(await getBuildingDetail("abc")).toEqual({ kind: "notFound" });
		});

		it("BUILDING_NOT_FOUND가 아닌 404는 오류를 던짐", async () => {
			fetchMock.mockResolvedValue(
				Response.json({ code: "PATH_NOT_FOUND" }, { status: 404 }),
			);

			await expect(getBuildingDetail("11440-망원동-519")).rejects.toThrow();
		});

		it("호출에 실패하면 오류를 던짐", async () => {
			fetchMock.mockRejectedValue(new Error("network"));

			await expect(getBuildingDetail("11440-망원동-519")).rejects.toThrow();
		});

		it("목업 실패 스위치를 따르지 않음", async () => {
			failure.value = "buildingFailed";
			fetchMock.mockResolvedValue(
				Response.json({
					data: { id: "x", name: "이름", address: "주소", deals: [] },
				}),
			);

			expect((await getBuildingDetail("x")).kind).toBe("found");
		});
	});
});
