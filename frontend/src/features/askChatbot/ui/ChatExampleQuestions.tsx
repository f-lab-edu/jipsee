import { Text, VStack } from "@seed-design/react";
import { chatExampleQuestionsStyles } from "@/features/askChatbot/config/chatExampleQuestionsStyles";
import { chatPanelCopy } from "@/features/askChatbot/config/chatPanelCopy";

/** 챗봇 > 예시 질문 */
export default function ChatExampleQuestions() {
	const style = chatExampleQuestionsStyles;

	return (
		<VStack {...style.list}>
			{chatPanelCopy.exampleQuestions.map((question) => (
				<Text key={question} as="p" {...style.text}>
					{question}
				</Text>
			))}
		</VStack>
	);
}
