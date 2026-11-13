import { Box, TextFieldInput, TextFieldRoot, VStack } from "@seed-design/react";
import type { Session } from "@/entities/session/model/session";
import { chatCompactBarStyles } from "@/features/askChatbot/config/chatCompactBarStyles";
import { chatPanelCopy } from "@/features/askChatbot/config/chatPanelCopy";
import ChatHistoryIconLink from "@/features/askChatbot/ui/ChatHistoryIconLink";
import ChatLoginLink from "@/features/askChatbot/ui/ChatLoginLink";
import ChatQuestionForm from "@/features/askChatbot/ui/ChatQuestionForm";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

interface ChatCompactBarProps {
	session: Nullable<Session>;
}

/**
 * 챗봇 > 모바일 축소 바
 *
 * - 화면 아래에 붙는 section
 * - 로그인 시 입력 앞에 지난 대화 아이콘 링크를 둔 질문 입력 폼 출력
 * - 비로그인 시 한 줄을 모두 쓰는 비활성화된 입력과 그 아래 줄에 로그인 유도 버튼 출력
 */
export default function ChatCompactBar({ session }: ChatCompactBarProps) {
	const style = chatCompactBarStyles;

	return (
		<Box
			as="section"
			aria-label={chatPanelCopy.compactLabel}
			data-area="chat-compact-bar"
			{...style.root}
		>
			{session && (
				<ChatQuestionForm variant="compactBar">
					<ChatHistoryIconLink style={style.historyLink} />
				</ChatQuestionForm>
			)}
			{!session && (
				<VStack {...style.loggedOut}>
					<TextFieldRoot disabled {...style.field}>
						<TextFieldInput
							aria-label={chatPanelCopy.questionLabel}
							placeholder={chatPanelCopy.compactPlaceholder}
						/>
					</TextFieldRoot>
					<ChatLoginLink style={style.loginLink} />
				</VStack>
			)}
		</Box>
	);
}
