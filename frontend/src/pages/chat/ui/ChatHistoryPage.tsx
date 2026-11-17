import { Box, HStack, VStack } from "@seed-design/react";
import type { ChatSummary } from "@/entities/chat/model/chatSummary";
import type { Session } from "@/entities/session/model/session";
import { chatCopy } from "@/pages/chat/config/chatCopy";
import { chatHistoryStyles } from "@/pages/chat/config/chatHistoryStyles";
import { chatScreenStyles } from "@/pages/chat/config/chatScreenStyles";
import ChatHistoryDesktopRedirect from "@/pages/chat/ui/ChatHistoryDesktopRedirect";
import ChatHistoryEmpty from "@/pages/chat/ui/ChatHistoryEmpty";
import ChatHistoryList from "@/pages/chat/ui/ChatHistoryList";
import ChatHistoryToolbarRow from "@/pages/chat/ui/ChatHistoryToolbarRow";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import type { FormErrorCode } from "@/shared/model/formErrorCode";
import { paths } from "@/shared/routes/paths";
import FormErrorNotice from "@/shared/ui/FormErrorNotice";
import Header from "@/widgets/header/ui/Header";
import HeaderBackButton from "@/widgets/header/ui/HeaderBackButton";

interface ChatHistoryPageProps {
	session: Session;
	chats: ChatSummary[];
	now: Date;
	formError: Nullable<FormErrorCode>;
}

/**
 * 채팅 > 대화 목록 페이지
 *
 * - 뒤로 가기가 있는 로고 헤더 출력
 * - 도구줄 아래에 대화 목록 출력. 대화가 없으면 안내 출력
 * - 1280 미만은 흰 열 안에 출력하고, 1280 이상은 대화 목록 레일이 있는 /chat으로 이동
 *
 * - 대화 삭제가 실패해 돌아왔으면 도구줄 아래, 목록 위에 실패 안내 출력
 *
 * @param now 시각 표시의 오늘과 어제를 정하는 기준
 * @param formError 폼 전송 실패 코드. 없으면 실패 안내를 출력하지 않음
 */
export default function ChatHistoryPage({
	session,
	chats,
	now,
	formError,
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
						{formError !== null && (
							<Box {...chatHistoryStyles.notice}>
								<FormErrorNotice code={formError} />
							</Box>
						)}
						{chats.length > 0 && <ChatHistoryList chats={chats} now={now} />}
						{chats.length === 0 && <ChatHistoryEmpty />}
					</VStack>
				</HStack>
			</VStack>
		</>
	);
}
