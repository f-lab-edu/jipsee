import { pendingQuestionHolder } from "@/features/askChatbot/model/pendingQuestionHolder";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

/**
 * 챗봇 > 대기 질문 꺼내기
 *
 * - 저장된 질문 반환
 * - 반환하면서 비움
 */
export function takePendingQuestion(): Nullable<string> {
	const question = pendingQuestionHolder.question;
	pendingQuestionHolder.question = null;

	return question;
}
