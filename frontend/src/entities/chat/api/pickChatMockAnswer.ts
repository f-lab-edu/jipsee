import { chatMockAnswers } from "@/entities/chat/api/chatMock";
import type { ChatMockAnswer } from "@/entities/chat/model/chatMockAnswer";

/**
 * 채팅 > 목업 답변 고르기
 *
 * - 전세 거래가 있으면 실거래 답변 반환
 * - 갱신이 있으면 법령 답변 반환
 * - 계약해도가 있으면 판단 요청 안내 반환
 * - 소송이 있으면 개별 사건 안내 반환
 * - 그 밖의 질문은 판단 요청 안내 반환
 */
export function pickChatMockAnswer(content: string): ChatMockAnswer {
	if (content.includes("전세 거래")) {
		return chatMockAnswers.deals;
	}

	if (content.includes("갱신")) {
		return chatMockAnswers.renewal;
	}

	if (content.includes("소송")) {
		return chatMockAnswers.refuseCase;
	}

	return chatMockAnswers.refuseJudgment;
}
