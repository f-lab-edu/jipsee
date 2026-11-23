import { beforeEach, describe, expect, it, vi } from "vitest";
import { getBuildingDetail } from "@/entities/building/api/getBuildingDetail";

const failure = vi.hoisted(() => ({ value: "none" }));

vi.mock("@/entities/building/api/readBuildingMockFailure", () => ({
	readBuildingMockFailure: async () => failure.value,
}));

describe("getBuildingDetail", () => {
	beforeEach(() => {
		failure.value = "none";
	});

	it("목업에 있는 id를 조회하면 found와 그 id의 상세를 반환함", async () => {
		const result = await getBuildingDetail("11440-망원동-15-1");

		expect(result.kind).toBe("found");
		expect(result.kind === "found" && result.detail.id).toBe(
			"11440-망원동-15-1",
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
});
