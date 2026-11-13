import { describe, expect, it } from "vitest";
import { toAskBuildingHref } from "@/features/askChatbot/lib/toAskBuildingHref";

describe("toAskBuildingHref", () => {
	it("로그인하지 않았으면 채팅 경로를 돌아갈 경로로 담은 로그인 경로를 반환함", () => {
		expect(toAskBuildingHref(3, null)).toBe(
			"/login?next=%2Fchat%3FbuildingId%3D3",
		);
	});

	it("로그인했으면 건물 번호를 담은 채팅 경로를 반환함", () => {
		expect(toAskBuildingHref(3, { provider: "GOOGLE" })).toBe(
			"/chat?buildingId=3",
		);
	});
});
