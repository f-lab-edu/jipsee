import { describe, expect, it } from "vitest";
import { getBuildingDetail } from "@/entities/building/api/getBuildingDetail";

describe("getBuildingDetail", () => {
	it("목업에 있는 id를 조회하면 그 id의 상세를 반환함", async () => {
		const detail = await getBuildingDetail(3);

		expect(detail?.id).toBe(3);
	});

	it("목업에 없는 id를 조회하면 null을 반환함", async () => {
		expect(await getBuildingDetail(999)).toBeNull();
	});
});
