"use client";

import { useState } from "react";
import type { ChatMessage } from "@/entities/chat/model/chatMessage";
import { takePendingQuestion } from "@/features/askChatbot/model/takePendingQuestion";
import { useChatConversation } from "@/features/sendChatMessage/model/useChatConversation";
import ChatComposer from "@/features/sendChatMessage/ui/ChatComposer";
import { toExampleQuestions } from "@/pages/chat/lib/toExampleQuestions";
import { useFollowBottom } from "@/pages/chat/model/useFollowBottom";
import ChatThread from "@/pages/chat/ui/ChatThread";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

interface ChatConversationProps {
	chatId: Nullable<number>;
	buildingId: Nullable<number>;
	initialMessages: ChatMessage[];
	isLimitReached: boolean;
}

/**
 * 채팅 > 대화
 *
 * - 메시지 목록과 질문 입력 바를 같은 대화 상태로 묶어 출력
 * - 홈에서 담아 둔 질문이 있으면 처음 그릴 때 첫 질문으로 바로 보냄
 * - 건물 기준 대화이면 건물 기준 예시 질문, 아니면 일반 예시 질문 출력
 * - 예시 질문을 누르면 입력에 채우기만 함
 * - 화면이 맨 아래에 있을 때만 새 글자를 따라 내려감. 질문을 보내면 다시 따라감
 */
export default function ChatConversation({
	chatId,
	buildingId,
	initialMessages,
	isLimitReached,
}: ChatConversationProps) {
	const [firstQuestion] = useState(takePendingQuestion);
	const [question, setQuestion] = useState("");
	const conversation = useChatConversation({
		chatId,
		buildingId,
		initialMessages,
		isLimitReached,
		firstQuestion,
	});
	const followBottom = useFollowBottom(
		`${conversation.messages.length}:${conversation.draft}:${conversation.phase}`,
	);
	const isSending =
		conversation.phase === "waiting" || conversation.phase === "streaming";

	const handleSend = (trimmedQuestion: string) => {
		followBottom();
		conversation.send(trimmedQuestion);
	};

	return (
		<>
			<ChatThread
				messages={conversation.messages}
				draft={conversation.draft}
				phase={conversation.phase}
				errorCode={conversation.errorCode}
				exampleQuestions={toExampleQuestions(buildingId)}
				onSelectExample={setQuestion}
				onRetry={conversation.retry}
			/>
			<ChatComposer
				question={question}
				onQuestionChange={setQuestion}
				onSend={handleSend}
				isSending={isSending}
				isLimitReached={conversation.phase === "limit"}
			/>
		</>
	);
}
