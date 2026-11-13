import { Box, HStack, Text, VisuallyHidden, VStack } from "@seed-design/react";
import { chatMessageCopy } from "@/entities/chat/config/chatMessageCopy";
import { chatMessageStyles } from "@/entities/chat/config/chatMessageStyles";

interface AssistantDraftProps {
	text: string;
}

/**
 * 채팅 > 작성 중인 답변 말풍선
 *
 * - aria-busy를 true로 두어 낭독을 끝난 뒤로 미룸
 * - 받은 글자가 없으면 점 세 개와 보이지 않는 안내 출력
 * - 받은 글자가 있으면 줄마다 문단으로 출력하고 마지막 줄 끝에 깜빡이는 커서 출력
 */
export default function AssistantDraft({ text }: AssistantDraftProps) {
	const style = chatMessageStyles;
	const lines = text.split("\n");

	return (
		<VStack
			as="article"
			data-area="chat-message-assistant"
			aria-busy="true"
			{...style.assistantArticle}
		>
			<VisuallyHidden asChild>
				<h2>{chatMessageCopy.assistantHeading}</h2>
			</VisuallyHidden>
			{text === "" && (
				<>
					<VisuallyHidden role="status">
						{chatMessageCopy.writing}
					</VisuallyHidden>
					<HStack aria-hidden="true" {...style.waitingBubble}>
						<Box {...style.waitingDot} />
						<Box {...style.waitingDot} />
						<Box {...style.waitingDot} />
					</HStack>
				</>
			)}
			{text !== "" && (
				<VStack {...style.assistantBubble}>
					{lines.map((line, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: 줄은 앞에서부터 이어 붙기만 함
						<Text key={index} as="p" {...style.assistantLine}>
							{line}
							{index === lines.length - 1 && (
								<Box as="span" aria-hidden="true" {...style.caret} />
							)}
						</Text>
					))}
				</VStack>
			)}
		</VStack>
	);
}
