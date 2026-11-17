import { describe, expect, it } from "vitest";
import { toLoadMoreAnnouncement } from "@/features/loadMoreBuildings/lib/toLoadMoreAnnouncement";

describe("toLoadMoreAnnouncement", () => {
	it("새로 붙은 건수를 넣어 알림 문구를 반환함", () => {
		expect(toLoadMoreAnnouncement(20)).toBe("20건을 더 불러왔어요");
		expect(toLoadMoreAnnouncement(8)).toBe("8건을 더 불러왔어요");
	});
});
