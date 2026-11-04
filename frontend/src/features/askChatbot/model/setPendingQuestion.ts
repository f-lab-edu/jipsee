import { pendingQuestionHolder } from "@/features/askChatbot/model/pendingQuestionHolder";

/** 챗봇 > 대기 질문 저장 */
export function setPendingQuestion(question: string): void {
	pendingQuestionHolder.question = question;
}
