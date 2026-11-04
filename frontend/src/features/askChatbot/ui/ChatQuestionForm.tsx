"use client";

import IconArrowUpLine from "@karrotmarket/react-monochrome-icon/IconArrowUpLine";
import { Box, Icon, TextFieldInput, TextFieldRoot } from "@seed-design/react";
import { useRouter } from "next/navigation";
import { type FormEvent, type ReactNode, useState } from "react";
import { chatPanelCopy } from "@/features/askChatbot/config/chatPanelCopy";
import { chatQuestionFormSettings } from "@/features/askChatbot/config/chatQuestionFormSettings";
import { chatQuestionFormStyles } from "@/features/askChatbot/config/chatQuestionFormStyles";
import type { ChatQuestionFormVariant } from "@/features/askChatbot/model/chatQuestionFormVariant";
import { setPendingQuestion } from "@/features/askChatbot/model/setPendingQuestion";
import { paths } from "@/shared/routes/paths";

interface ChatQuestionFormProps {
	variant: ChatQuestionFormVariant;
	children?: ReactNode;
}

/**
 * 챗봇 > 질문 입력 폼
 *
 * - 질문 입력과 오른쪽 보내기 버튼 출력
 * - 공백만 있으면 이동하지 않음
 * - 값이 있으면 앞뒤 공백을 지운 질문을 보관하고 채팅 경로로 이동
 *
 * @param variant 입력 모양. placeholder와 입력 모양 클래스를 고름
 * @param children 입력 앞에 출력하는 요소
 */
export default function ChatQuestionForm({
	variant,
	children,
}: ChatQuestionFormProps) {
	const style = chatQuestionFormStyles;
	const setting = chatQuestionFormSettings[variant];
	const router = useRouter();
	const [question, setQuestion] = useState("");

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const trimmedQuestion = question.trim();

		if (trimmedQuestion === "") {
			return;
		}

		setPendingQuestion(trimmedQuestion);
		router.push(paths.chat);
	};

	return (
		<form onSubmit={handleSubmit}>
			<TextFieldRoot
				value={question}
				onValueChange={setQuestion}
				className={setting.className}
			>
				{children}
				<TextFieldInput
					aria-label={chatPanelCopy.questionLabel}
					placeholder={setting.placeholder}
					enterKeyHint="send"
				/>
				<Box asChild {...style.sendButton}>
					<button type="submit" aria-label={chatPanelCopy.send}>
						<Icon svg={<IconArrowUpLine />} {...style.sendIcon} />
					</button>
				</Box>
			</TextFieldRoot>
		</form>
	);
}
