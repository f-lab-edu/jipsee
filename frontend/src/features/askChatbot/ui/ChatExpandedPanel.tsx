import { HStack, Icon, Text, VStack } from "@seed-design/react";
import { useId } from "react";
import type { Session } from "@/entities/session/model/session";
import { chatExpandedPanelStyles } from "@/features/askChatbot/config/chatExpandedPanelStyles";
import { chatPanelCopy } from "@/features/askChatbot/config/chatPanelCopy";
import ChatBubbleIcon from "@/features/askChatbot/ui/ChatBubbleIcon";
import ChatExampleQuestions from "@/features/askChatbot/ui/ChatExampleQuestions";
import ChatHistoryTextLink from "@/features/askChatbot/ui/ChatHistoryTextLink";
import ChatLoginLink from "@/features/askChatbot/ui/ChatLoginLink";
import ChatQuestionForm from "@/features/askChatbot/ui/ChatQuestionForm";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

interface ChatExpandedPanelProps {
	session: Nullable<Session>;
}

/**
 * 챗봇 > 모바일 펼침 패널
 *
 * - 화면 아래에 붙는 section
 * - 제목, 예시 질문 출력
 * - 로그인 시 제목 줄 오른쪽에 지난 대화 링크, 예시 질문 아래에 질문 입력 폼 출력
 * - 비로그인 시 로그인 유도 버튼 출력
 */
export default function ChatExpandedPanel({ session }: ChatExpandedPanelProps) {
	const style = chatExpandedPanelStyles;
	const titleId = useId();

	return (
		<VStack
			as="section"
			aria-labelledby={titleId}
			data-area="chat-panel-mobile"
			{...style.root}
		>
			<HStack {...style.titleRow}>
				<Icon svg={<ChatBubbleIcon />} {...style.titleIcon} />
				<Text as="h2" id={titleId} {...style.title}>
					{chatPanelCopy.title}
				</Text>
				{session && <ChatHistoryTextLink style={style.historyLink} />}
			</HStack>
			<ChatExampleQuestions />
			{session && <ChatQuestionForm variant="expandedPanel" />}
			{!session && <ChatLoginLink style={style.loginLink} />}
		</VStack>
	);
}
