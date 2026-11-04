import { Box, TextFieldInput, TextFieldRoot } from "@seed-design/react";
import type { Session } from "@/entities/session/model/session";
import { chatCompactBarStyles } from "@/features/askChatbot/config/chatCompactBarStyles";
import { chatPanelCopy } from "@/features/askChatbot/config/chatPanelCopy";
import ChatLoginLink from "@/features/askChatbot/ui/ChatLoginLink";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

interface ChatCompactBarProps {
	session: Nullable<Session>;
}

/**
 * 챗봇 > 모바일 축소 바
 *
 * - 화면 아래에 붙는 section
 * - 비활성화된 입력 출력
 * - 비로그인 시 입력 안 오른쪽에 로그인 유도 버튼 출력
 */
export default function ChatCompactBar({ session }: ChatCompactBarProps) {
	const style = chatCompactBarStyles;

	return (
		<Box as="section" aria-label={chatPanelCopy.compactLabel} {...style.root}>
			<TextFieldRoot disabled {...style.field}>
				<TextFieldInput
					aria-label={chatPanelCopy.questionLabel}
					placeholder={chatPanelCopy.compactPlaceholder}
				/>
				{!session && <ChatLoginLink style={style.loginLink} />}
			</TextFieldRoot>
		</Box>
	);
}
