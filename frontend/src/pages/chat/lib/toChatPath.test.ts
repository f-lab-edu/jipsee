import { describe, expect, it } from "vitest";
import { toChatPath } from "@/pages/chat/lib/toChatPath";

describe("toChatPath", () => {
	it("buildingId가 문자열이면 쿼리에 담아 반환함", () => {
		expect(toChatPath("3")).toBe("/chat?buildingId=3");
	});

	it("buildingId가 없으면 채팅 경로를 반환함", () => {
		expect(toChatPath(undefined)).toBe("/chat");
	});

	it("값이 둘 이상이면 채팅 경로를 반환함", () => {
		expect(toChatPath(["1", "2"])).toBe("/chat");
	});
});
