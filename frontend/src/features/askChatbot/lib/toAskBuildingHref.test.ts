import { describe, expect, it } from "vitest";
import { toAskBuildingHref } from "@/features/askChatbot/lib/toAskBuildingHref";

describe("toAskBuildingHref", () => {
	it("로그인하지 않았으면 채팅 경로를 돌아갈 경로로 담은 로그인 경로를 반환함", () => {
		expect(toAskBuildingHref("11440-망원동-12-3", null)).toBe(
			"/login?next=%2Fchat%3FbuildingId%3D11440-%25EB%25A7%259D%25EC%259B%2590%25EB%258F%2599-12-3",
		);
	});

	it("로그인했으면 건물 번호를 담은 채팅 경로를 반환함", () => {
		expect(toAskBuildingHref("11440-망원동-12-3", { provider: "GOOGLE" })).toBe(
			"/chat?buildingId=11440-%EB%A7%9D%EC%9B%90%EB%8F%99-12-3",
		);
	});
});
