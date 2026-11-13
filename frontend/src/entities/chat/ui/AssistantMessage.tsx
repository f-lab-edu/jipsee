import { Text, VisuallyHidden, VStack } from "@seed-design/react";
import { chatMessageCopy } from "@/entities/chat/config/chatMessageCopy";
import { chatMessageStyles } from "@/entities/chat/config/chatMessageStyles";
import type { ChatMessage } from "@/entities/chat/model/chatMessage";
import MessageBuildingLink from "@/entities/chat/ui/MessageBuildingLink";
import MessageSources from "@/entities/chat/ui/MessageSources";

interface AssistantMessageProps {
	message: ChatMessage;
}

/**
 * 채팅 > 답변 말풍선
 *
 * - 본문을 줄마다 문단으로 출력
 * - 출처가 있으면 출처 묶음, 건물이 있으면 건물마다 상세 링크를 말풍선 안 아래에 출력
 * - 보이지 않는 제목으로 집사 답변 출력
 */
export default function AssistantMessage({ message }: AssistantMessageProps) {
	const style = chatMessageStyles;

	return (
		<VStack
			as="article"
			data-area="chat-message-assistant"
			{...style.assistantArticle}
		>
			<VisuallyHidden asChild>
				<h2>{chatMessageCopy.assistantHeading}</h2>
			</VisuallyHidden>
			<VStack {...style.assistantBubble}>
				{message.content.split("\n").map((line, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: 줄은 바뀌지 않는 본문을 나눈 값임
					<Text key={index} as="p" {...style.assistantLine}>
						{line}
					</Text>
				))}
				{message.sources.length > 0 && (
					<MessageSources sources={message.sources} />
				)}
				{message.buildings.map((building) => (
					<MessageBuildingLink key={building.id} building={building} />
				))}
			</VStack>
		</VStack>
	);
}
