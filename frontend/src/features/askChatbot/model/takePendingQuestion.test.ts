import { describe, expect, it } from "vitest";
import { setPendingQuestion } from "@/features/askChatbot/model/setPendingQuestion";
import { takePendingQuestion } from "@/features/askChatbot/model/takePendingQuestion";

describe("takePendingQuestion", () => {
	it("저장한 질문을 한 번 꺼내면 같은 값을 반환하고 두 번째는 null을 반환함", () => {
		setPendingQuestion("망원동 전세 시세 알려줘");

		expect(takePendingQuestion()).toBe("망원동 전세 시세 알려줘");
		expect(takePendingQuestion()).toBeNull();
	});
});
