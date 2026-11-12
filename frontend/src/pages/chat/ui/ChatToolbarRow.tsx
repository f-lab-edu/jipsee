import { Box, HStack, Text } from "@seed-design/react";
import Link from "next/link";
import { chatCopy } from "@/pages/chat/config/chatCopy";
import { chatScreenStyles } from "@/pages/chat/config/chatScreenStyles";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";
import { paths } from "@/shared/routes/paths";

interface ChatToolbarRowProps {
	layout: ResponsiveVariant;
}

/**
 * 채팅 > 도구줄 한 줄
 *
 * - 왼쪽에 제목 h1, 오른쪽에 대화 목록과 새 대화 링크 출력
 *
 * @param layout 글자 크기, 버튼 높이, 아래 테두리를 정함
 */
export default function ChatToolbarRow({ layout }: ChatToolbarRowProps) {
	const style = chatScreenStyles.toolbar[layout];

	return (
		<HStack {...style.root}>
			<HStack {...style.titleGroup}>
				<Text as="h1" {...style.title}>
					{chatCopy.title}
				</Text>
			</HStack>
			<HStack {...style.actions}>
				<Box asChild {...style.button}>
					<Link href={paths.chatHistory} aria-label={chatCopy.historyLabel}>
						<Text {...style.buttonText}>{chatCopy.historyButton}</Text>
					</Link>
				</Box>
				<Box asChild {...style.button}>
					<Link href={paths.chat}>
						<Text {...style.buttonText}>{chatCopy.newChat}</Text>
					</Link>
				</Box>
			</HStack>
		</HStack>
	);
}
