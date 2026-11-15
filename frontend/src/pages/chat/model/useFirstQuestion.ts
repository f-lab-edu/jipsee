import { useState } from "react";
import { takePendingQuestion } from "@/features/askChatbot/model/takePendingQuestion";

/**
 * 채팅 > 첫 질문
 *
 * - 처음 그릴 때 홈에서 담아 둔 질문을 한 번 꺼내 유지
 * - 담아 둔 질문이 없으면 null 반환
 */
export function useFirstQuestion() {
	const [firstQuestion] = useState(takePendingQuestion);

	return firstQuestion;
}
