import { Box, Text, VStack } from "@seed-design/react";
import type { ChatSummary } from "@/entities/chat/model/chatSummary";
import { chatCopy } from "@/pages/chat/config/chatCopy";
import { chatRailStyles } from "@/pages/chat/config/chatRailStyles";
import ChatRailEmpty from "@/pages/chat/ui/ChatRailEmpty";
import ChatRailList from "@/pages/chat/ui/ChatRailList";
import ChatRailNewChat from "@/pages/chat/ui/ChatRailNewChat";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import type { FormErrorCode } from "@/shared/model/formErrorCode";
import FormErrorNotice from "@/shared/ui/FormErrorNotice";

interface ChatRailProps {
	chats: ChatSummary[];
	now: Date;
	chatId: Nullable<number>;
	formError: Nullable<FormErrorCode>;
}

/**
 * 채팅 > 대화 목록 레일
 *
 * - 1280 이상에서만 대화 영역 왼쪽에 출력
 * - 대화 삭제가 실패해 돌아왔으면 맨 위에 실패 안내 출력
 * - 맨 위에 제목 h1과 새 대화 링크, 아래에 대화 목록 출력. 대화가 없으면 안내 출력
 * - 지금 보는 대화를 표시하고, 새 대화이면 새 대화 링크를 표시
 *
 * @param chatId 지금 보는 대화 번호. 새 대화이면 null
 * @param now 시각 표시의 오늘과 어제를 정하는 기준
 * @param formError 폼 전송 실패 코드. 없으면 실패 안내를 출력하지 않음
 */
export default function ChatRail({
	chats,
	now,
	chatId,
	formError,
}: ChatRailProps) {
	const style = chatRailStyles;

	return (
		<VStack as="aside" data-area="chat-rail" {...style.root}>
			<VStack {...style.inner}>
				{formError !== null && (
					<Box {...style.notice}>
						<FormErrorNotice code={formError} />
					</Box>
				)}
				<VStack
					data-testid="chat-toolbar-desktop"
					data-area="chat-toolbar-desktop"
					{...style.toolbar}
				>
					<Box {...style.titleBox}>
						<Text as="h1" {...style.title}>
							{chatCopy.title}
						</Text>
					</Box>
					<ChatRailNewChat isCurrent={chatId === null} />
				</VStack>
				<Box {...style.headingBox}>
					<Text as="h2" {...style.heading}>
						{chatCopy.historyTitle}
					</Text>
				</Box>
				{chats.length > 0 && (
					<ChatRailList chats={chats} now={now} chatId={chatId} />
				)}
				{chats.length === 0 && <ChatRailEmpty />}
			</VStack>
		</VStack>
	);
}
