import { Box, Icon, Text, VStack } from "@seed-design/react";
import { useId } from "react";
import ChatBubbleIcon from "@/features/askChatbot/ui/ChatBubbleIcon";
import { chatCopy } from "@/pages/chat/config/chatCopy";
import { chatThreadStyles } from "@/pages/chat/config/chatThreadStyles";

interface ChatEmptyProps {
	exampleQuestions: readonly string[];
	showsExamples: boolean;
	onSelect: (question: string) => void;
}

/**
 * 채팅 > 빈 대화
 *
 * - 말풍선 아이콘과 제목 출력
 * - 예시 질문이 있으면 버튼으로 출력하고 누르면 입력에 채울 질문을 전달
 *
 * @param showsExamples 예시 질문 출력 여부. 질문할 수 없으면 숨김
 * @param onSelect 예시 질문을 누르면 호출. 전송하지 않음
 */
export default function ChatEmpty({
	exampleQuestions,
	showsExamples,
	onSelect,
}: ChatEmptyProps) {
	const style = chatThreadStyles;
	const titleId = useId();

	return (
		<VStack
			as="section"
			aria-labelledby={titleId}
			data-area="chat-empty"
			{...style.empty}
		>
			<VStack {...style.emptyHeading}>
				<Box aria-hidden="true" {...style.emptyIcon}>
					<Icon svg={<ChatBubbleIcon />} {...style.emptyIconSvg} />
				</Box>
				<Text as="h2" id={titleId} {...style.emptyTitle}>
					{chatCopy.emptyTitle}
				</Text>
			</VStack>
			{showsExamples && (
				<VStack as="ul" data-area="chat-example-questions" {...style.examples}>
					{exampleQuestions.map((question) => (
						<li key={question}>
							<Box asChild {...style.example}>
								<button type="button" onClick={() => onSelect(question)}>
									<Text {...style.exampleText}>{question}</Text>
								</button>
							</Box>
						</li>
					))}
				</VStack>
			)}
		</VStack>
	);
}
