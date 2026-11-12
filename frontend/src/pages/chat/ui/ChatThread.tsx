import { VStack } from "@seed-design/react";
import type { ChatMessage } from "@/entities/chat/model/chatMessage";
import AssistantDraft from "@/entities/chat/ui/AssistantDraft";
import type { ChatPhase } from "@/features/sendChatMessage/model/chatPhase";
import { chatCopy } from "@/pages/chat/config/chatCopy";
import { chatThreadStyles } from "@/pages/chat/config/chatThreadStyles";
import ChatEmpty from "@/pages/chat/ui/ChatEmpty";
import ChatErrorNotice from "@/pages/chat/ui/ChatErrorNotice";
import ChatMessageItem from "@/pages/chat/ui/ChatMessageItem";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

interface ChatThreadProps {
	messages: ChatMessage[];
	draft: string;
	phase: ChatPhase;
	errorCode: Nullable<"TOO_MANY_REQUESTS" | "SERVER_ERROR">;
	exampleQuestions: readonly string[];
	onSelectExample: (question: string) => void;
	onRetry: () => void;
}

/**
 * 채팅 > 메시지 목록
 *
 * - role이 log인 영역이고 새 메시지와 글자를 낭독함
 * - 메시지가 없으면 빈 대화 출력. 한도를 모두 사용했으면 예시 질문은 숨김
 * - 메시지를 차례로 출력하고 대기나 스트리밍 중이면 작성 중인 답변을 끝에 출력
 * - 오류이면 실패한 질문 아래에 오류 상자 출력
 */
export default function ChatThread({
	messages,
	draft,
	phase,
	errorCode,
	exampleQuestions,
	onSelectExample,
	onRetry,
}: ChatThreadProps) {
	const style = chatThreadStyles;
	const isDrafting = phase === "waiting" || phase === "streaming";

	return (
		<VStack
			role="log"
			aria-live="polite"
			aria-relevant="additions text"
			aria-label={chatCopy.threadLabel}
			data-area="chat-thread"
			{...style.thread}
		>
			{messages.length === 0 && (
				<ChatEmpty
					exampleQuestions={exampleQuestions}
					showsExamples={phase !== "limit"}
					onSelect={onSelectExample}
				/>
			)}
			{messages.map((message) => (
				<ChatMessageItem key={message.id} message={message} />
			))}
			{isDrafting && <AssistantDraft text={draft} />}
			{phase === "error" && errorCode !== null && (
				<ChatErrorNotice code={errorCode} onRetry={onRetry} />
			)}
		</VStack>
	);
}
