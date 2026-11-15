import { describe, expect, it } from "vitest";
import { getBuildingDetail } from "@/entities/building/api/getBuildingDetail";

describe("getBuildingDetail", () => {
	it("목업에 있는 id를 조회하면 found와 그 id의 상세를 반환함", async () => {
		const result = await getBuildingDetail(3);

		expect(result.kind).toBe("found");
		expect(result.kind === "found" && result.detail.id).toBe(3);
	});

	it("목업에 없는 id를 조회하면 notFound를 반환함", async () => {
		expect(await getBuildingDetail(999)).toEqual({ kind: "notFound" });
	});
});
