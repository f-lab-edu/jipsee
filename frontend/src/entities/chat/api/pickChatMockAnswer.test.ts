import { describe, expect, it } from "vitest";
import { chatMockAnswers } from "@/entities/chat/api/chatMock";
import { pickChatMockAnswer } from "@/entities/chat/api/pickChatMockAnswer";

describe("pickChatMockAnswer", () => {
	it("전세 거래가 있으면 실거래 답변을 반환함", () => {
		expect(pickChatMockAnswer("○○빌라 주변 전세 거래 알려줘")).toBe(
			chatMockAnswers.deals,
		);
	});

	it("갱신이 있으면 법령 답변을 반환함", () => {
		expect(pickChatMockAnswer("계약갱신요구권은 언제 쓰나요?")).toBe(
			chatMockAnswers.renewal,
		);
	});

	it("소송이 있으면 개별 사건 안내를 반환함", () => {
		expect(pickChatMockAnswer("보증금 소송 이길 수 있나요?")).toBe(
			chatMockAnswers.refuseCase,
		);
	});

	it("그 밖의 질문은 판단 요청 안내를 반환함", () => {
		expect(pickChatMockAnswer("이 집 계약해도 괜찮을까요?")).toBe(
			chatMockAnswers.refuseJudgment,
		);
		expect(pickChatMockAnswer("전입신고는 언제 해야 해?")).toBe(
			chatMockAnswers.refuseJudgment,
		);
	});
});
