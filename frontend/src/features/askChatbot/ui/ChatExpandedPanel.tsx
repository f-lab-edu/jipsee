import { HStack, Icon, Text, VStack } from "@seed-design/react";
import { useId } from "react";
import type { Session } from "@/entities/session/model/session";
import { chatExpandedPanelStyles } from "@/features/askChatbot/config/chatExpandedPanelStyles";
import { chatPanelCopy } from "@/features/askChatbot/config/chatPanelCopy";
import ChatBubbleIcon from "@/features/askChatbot/ui/ChatBubbleIcon";
import ChatExampleQuestions from "@/features/askChatbot/ui/ChatExampleQuestions";
import ChatLoginLink from "@/features/askChatbot/ui/ChatLoginLink";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

interface ChatExpandedPanelProps {
	session: Nullable<Session>;
}

/**
 * 챗봇 > 모바일 펼침 패널
 *
 * - 화면 아래에 붙는 section
 * - 제목, 예시 질문 출력
 * - 비로그인 시 로그인 유도 버튼 출력
 */
export default function ChatExpandedPanel({ session }: ChatExpandedPanelProps) {
	const style = chatExpandedPanelStyles;
	const titleId = useId();

	return (
		<VStack as="section" aria-labelledby={titleId} {...style.root}>
			<HStack {...style.titleRow}>
				<Icon svg={<ChatBubbleIcon />} {...style.titleIcon} />
				<Text as="h2" id={titleId} {...style.title}>
					{chatPanelCopy.title}
				</Text>
			</HStack>
			<ChatExampleQuestions />
			{!session && <ChatLoginLink style={style.loginLink} />}
		</VStack>
	);
}
