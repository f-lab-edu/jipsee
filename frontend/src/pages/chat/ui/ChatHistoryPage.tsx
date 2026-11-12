import { VStack } from "@seed-design/react";
import type { ChatSummary } from "@/entities/chat/model/chatSummary";
import type { Session } from "@/entities/session/model/session";
import { chatCopy } from "@/pages/chat/config/chatCopy";
import { chatScreenStyles } from "@/pages/chat/config/chatScreenStyles";
import ChatHistoryEmpty from "@/pages/chat/ui/ChatHistoryEmpty";
import ChatHistoryList from "@/pages/chat/ui/ChatHistoryList";
import ChatHistoryToolbarRow from "@/pages/chat/ui/ChatHistoryToolbarRow";
import { paths } from "@/shared/routes/paths";
import ResponsiveLayout from "@/shared/ui/ResponsiveLayout";
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
 * - 1280 미만은 흰 열 안에, 1280 이상은 하늘빛 배경 위 폭 720 카드 안에 출력
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
				<VStack
					as="section"
					aria-label={chatCopy.historyTitle}
					data-area="chat-card"
					{...style.card}
				>
					<ResponsiveLayout
						testId="chat-toolbar"
						mobile={<ChatHistoryToolbarRow layout="mobile" />}
						desktop={<ChatHistoryToolbarRow layout="desktop" />}
					/>
					{chats.length > 0 && <ChatHistoryList chats={chats} now={now} />}
					{chats.length === 0 && <ChatHistoryEmpty />}
				</VStack>
			</VStack>
		</>
	);
}
