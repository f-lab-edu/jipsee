import { describe, expect, it } from "vitest";
import { searchBuildingsIfPresent } from "@/pages/home/lib/searchBuildingsIfPresent";

describe("searchBuildingsIfPresent", () => {
	it("검색어가 비어 있으면 검색하지 않고 null을 반환함", async () => {
		expect(await searchBuildingsIfPresent("")).toBeNull();
	});

	it("검색어가 있으면 null이 아닌 검색 결과를 반환함", async () => {
		expect(await searchBuildingsIfPresent("망원동")).not.toBeNull();
	});
});
