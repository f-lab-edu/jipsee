import { describe, expect, it } from "vitest";
import { toChatTimeLabel } from "@/entities/chat/lib/toChatTimeLabel";

const now = new Date("2026-11-13T15:00:00+09:00");

describe("toChatTimeLabel", () => {
	it("오늘이면 오늘과 시각을 두 자리로 반환함", () => {
		expect(toChatTimeLabel("2026-11-13T09:05:00+09:00", now)).toBe(
			"오늘 09:05",
		);
	});

	it("어제이면 어제를 반환함", () => {
		expect(toChatTimeLabel("2026-11-12T23:59:00+09:00", now)).toBe("어제");
	});

	it("같은 해이면 월과 일을 자리 채움 없이 반환함", () => {
		expect(toChatTimeLabel("2026-10-21T10:00:00+09:00", now)).toBe("10.21");
		expect(toChatTimeLabel("2026-01-05T10:00:00+09:00", now)).toBe("1.5");
	});

	it("다른 해이면 연도를 붙여 반환함", () => {
		expect(toChatTimeLabel("2025-12-30T10:00:00+09:00", now)).toBe(
			"2025.12.30",
		);
	});

	it("서버 시간대와 상관없이 한국 시간 날짜로 비교함", () => {
		expect(toChatTimeLabel("2026-11-12T16:00:00Z", now)).toBe("오늘 01:00");
	});
});
