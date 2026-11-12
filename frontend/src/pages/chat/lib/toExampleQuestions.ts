import { chatCopy } from "@/pages/chat/config/chatCopy";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

/**
 * 채팅 > 예시 질문 선택
 *
 * - 건물 기준 대화이면 건물 기준 예시 질문 반환
 * - 그 밖에는 일반 예시 질문 반환
 */
export function toExampleQuestions(
	buildingId: Nullable<number>,
): readonly string[] {
	if (buildingId !== null) {
		return chatCopy.buildingExampleQuestions;
	}

	return chatCopy.exampleQuestions;
}
