"use client";

import { Box, TextFieldInput, TextFieldRoot } from "@seed-design/react";
import type { FormEvent } from "react";
import { composerCopy } from "@/features/sendChatMessage/config/composerCopy";
import { composerStyles } from "@/features/sendChatMessage/config/composerStyles";
import ChatLimitNotice from "@/features/sendChatMessage/ui/ChatLimitNotice";
import SendButton from "@/features/sendChatMessage/ui/SendButton";

interface ChatComposerProps {
	question: string;
	onQuestionChange: (question: string) => void;
	onSend: (question: string) => void;
	isSending: boolean;
	isLimitReached: boolean;
}

/**
 * 채팅 > 질문 입력 바
 *
 * - 한도를 모두 사용했으면 입력 대신 한도 안내 출력
 * - 질문 입력과 오른쪽 보내기 버튼 출력
 * - 공백만 있으면 보내지 않음
 * - 값이 있으면 앞뒤 공백을 지운 질문을 보내고 입력을 비움
 * - 전송 중에는 보내기 버튼만 비활성화하고 입력은 계속 쓸 수 있음
 *
 * @param onSend 앞뒤 공백을 지운 질문을 받음
 */
export default function ChatComposer({
	question,
	onQuestionChange,
	onSend,
	isSending,
	isLimitReached,
}: ChatComposerProps) {
	const style = composerStyles;

	if (isLimitReached) {
		return <ChatLimitNotice />;
	}

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const trimmedQuestion = question.trim();

		if (trimmedQuestion === "") {
			return;
		}

		onSend(trimmedQuestion);
		onQuestionChange("");
	};

	return (
		<Box
			as="section"
			aria-label={composerCopy.sectionLabel}
			data-area="chat-composer"
			{...style.bar}
		>
			<Box asChild {...style.form}>
				<form onSubmit={handleSubmit}>
					<TextFieldRoot
						value={question}
						onValueChange={onQuestionChange}
						{...style.field}
					>
						<TextFieldInput
							aria-label={composerCopy.questionLabel}
							placeholder={composerCopy.questionPlaceholder}
							enterKeyHint="send"
						/>
						<SendButton isDisabled={isSending} />
					</TextFieldRoot>
				</form>
			</Box>
		</Box>
	);
}
