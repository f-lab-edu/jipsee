import { describe, expect, it } from "vitest";
import { toNearbyNoticeTitle } from "@/pages/building/lib/toNearbyNoticeTitle";

describe("toNearbyNoticeTitle", () => {
	it("기준 건수인 3건과 그보다 많은 5건이면 null을 반환함", () => {
		expect(toNearbyNoticeTitle(3)).toBeNull();
		expect(toNearbyNoticeTitle(5)).toBeNull();
	});

	it("기준 건수보다 적은 2건과 1건이면 건수가 들어간 제목을 반환함", () => {
		expect(toNearbyNoticeTitle(2)).toBe("조건에 맞는 거래 2건");
		expect(toNearbyNoticeTitle(1)).toBe("조건에 맞는 거래 1건");
	});

	it("0건이면 거래가 없다는 제목을 반환함", () => {
		expect(toNearbyNoticeTitle(0)).toBe("조건에 맞는 거래가 없어요");
	});
});
