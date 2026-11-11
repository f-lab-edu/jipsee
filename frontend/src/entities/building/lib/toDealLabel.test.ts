import { describe, expect, it } from "vitest";
import { toDealLabel } from "@/entities/building/lib/toDealLabel";

describe("toDealLabel", () => {
	it("전세와 월세는 계약 구분을 유형 앞에 붙임", () => {
		expect(toDealLabel({ type: "jeonse", contract: "new" })).toBe("신규 전세");
		expect(toDealLabel({ type: "jeonse", contract: "renewal" })).toBe(
			"갱신 전세",
		);
		expect(toDealLabel({ type: "wolse", contract: "new" })).toBe("신규 월세");
		expect(toDealLabel({ type: "wolse", contract: "renewal" })).toBe(
			"갱신 월세",
		);
	});

	it("전세와 월세는 계약 구분이 없으면 유형만 출력함", () => {
		expect(toDealLabel({ type: "jeonse", contract: null })).toBe("전세");
		expect(toDealLabel({ type: "wolse", contract: null })).toBe("월세");
	});

	it("매매는 계약 구분이 있어도 매매만 출력함", () => {
		expect(toDealLabel({ type: "sale", contract: "new" })).toBe("매매");
		expect(toDealLabel({ type: "sale", contract: null })).toBe("매매");
	});
});
