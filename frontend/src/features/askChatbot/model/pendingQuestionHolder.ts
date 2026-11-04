import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

// 새로고침하면 사라지는 클라이언트 모듈 변수
export const pendingQuestionHolder: { question: Nullable<string> } = {
	question: null,
};
