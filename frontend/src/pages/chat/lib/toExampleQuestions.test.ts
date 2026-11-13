import { describe, expect, it } from "vitest";
import { chatCopy } from "@/pages/chat/config/chatCopy";
import { toExampleQuestions } from "@/pages/chat/lib/toExampleQuestions";

describe("toExampleQuestions", () => {
	it("건물 기준 대화이면 건물 기준 예시 질문을 반환함", () => {
		expect(toExampleQuestions(1)).toBe(chatCopy.buildingExampleQuestions);
	});

	it("건물이 없으면 일반 예시 질문을 반환함", () => {
		expect(toExampleQuestions(null)).toBe(chatCopy.exampleQuestions);
	});
});
