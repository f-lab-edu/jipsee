import { Box, HStack, Icon, Text, VStack } from "@seed-design/react";
import { useId } from "react";
import type { Session } from "@/entities/session/model/session";
import { chatPanelCopy } from "@/features/askChatbot/config/chatPanelCopy";
import { chatPanelDesktopStyles } from "@/features/askChatbot/config/chatPanelDesktopStyles";
import ChatBubbleIcon from "@/features/askChatbot/ui/ChatBubbleIcon";
import ChatExampleQuestions from "@/features/askChatbot/ui/ChatExampleQuestions";
import ChatHistoryTextLink from "@/features/askChatbot/ui/ChatHistoryTextLink";
import ChatLoginLink from "@/features/askChatbot/ui/ChatLoginLink";
import ChatQuestionForm from "@/features/askChatbot/ui/ChatQuestionForm";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

interface ChatPanelDesktopProps {
	session: Nullable<Session>;
}

/**
 * 챗봇 > 데스크톱 aside
 *
 * - 페이지에서 유일한 aside
 * - 스크롤해도 화면 위쪽에 붙고 높이는 화면 높이를 넘지 않음
 * - 제목, 예시 질문 출력
 * - 로그인 시 제목 줄 오른쪽에 지난 대화 링크, 맨 아래에 질문 입력 폼 출력
 * - 비로그인 시 맨 아래에 로그인 유도 버튼 출력
 */
export default function ChatPanelDesktop({ session }: ChatPanelDesktopProps) {
	const style = chatPanelDesktopStyles;
	const titleId = useId();

	return (
		<VStack
			as="aside"
			aria-labelledby={titleId}
			data-area="chat-panel-desktop"
			{...style.root}
		>
			<HStack {...style.titleRow}>
				<Box {...style.iconBox}>
					<Icon svg={<ChatBubbleIcon />} {...style.icon} />
				</Box>
				<Text as="h2" id={titleId} {...style.title}>
					{chatPanelCopy.title}
				</Text>
				{session && <ChatHistoryTextLink style={style.historyLink} />}
			</HStack>
			<ChatExampleQuestions />
			{session && (
				<Box {...style.questionForm}>
					<ChatQuestionForm variant="desktopAside" />
				</Box>
			)}
			{!session && <ChatLoginLink style={style.loginLink} />}
		</VStack>
	);
}
