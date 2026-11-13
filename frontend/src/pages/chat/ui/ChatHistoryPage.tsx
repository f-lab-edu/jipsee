import { Box, HStack, VStack } from "@seed-design/react";
import type { ChatSummary } from "@/entities/chat/model/chatSummary";
import type { Session } from "@/entities/session/model/session";
import { chatCopy } from "@/pages/chat/config/chatCopy";
import { chatScreenStyles } from "@/pages/chat/config/chatScreenStyles";
import ChatHistoryDesktopRedirect from "@/pages/chat/ui/ChatHistoryDesktopRedirect";
import ChatHistoryEmpty from "@/pages/chat/ui/ChatHistoryEmpty";
import ChatHistoryList from "@/pages/chat/ui/ChatHistoryList";
import ChatHistoryToolbarRow from "@/pages/chat/ui/ChatHistoryToolbarRow";
import { paths } from "@/shared/routes/paths";
import Header from "@/widgets/header/ui/Header";
import HeaderBackButton from "@/widgets/header/ui/HeaderBackButton";

interface ChatHistoryPageProps {
	session: Session;
	chats: ChatSummary[];
	now: Date;
}

/**
 * 채팅 > 대화 목록 페이지
 *
 * - 뒤로 가기가 있는 로고 헤더 출력
 * - 도구줄 아래에 대화 목록 출력. 대화가 없으면 안내 출력
 * - 1280 미만은 흰 열 안에 출력하고, 1280 이상은 대화 목록 레일이 있는 /chat으로 이동
 *
 * @param now 시각 표시의 오늘과 어제를 정하는 기준
 */
export default function ChatHistoryPage({
	session,
	chats,
	now,
}: ChatHistoryPageProps) {
	const style = chatScreenStyles;

	return (
		<>
			<Header
				session={session}
				currentPath={paths.chatHistory}
				mobileBack={<HeaderBackButton />}
			/>
			<VStack as="main" data-area="main" {...style.main}>
				<ChatHistoryDesktopRedirect />
				<HStack
					as="section"
					aria-label={chatCopy.historyTitle}
					data-area="chat-card"
					{...style.hiddenOnDesktopCard}
				>
					<VStack {...style.pane}>
						<Box
							data-testid="chat-toolbar-mobile"
							data-area="chat-toolbar-mobile"
						>
							<ChatHistoryToolbarRow />
						</Box>
						{chats.length > 0 && <ChatHistoryList chats={chats} now={now} />}
						{chats.length === 0 && <ChatHistoryEmpty />}
					</VStack>
				</HStack>
			</VStack>
		</>
	);
}
