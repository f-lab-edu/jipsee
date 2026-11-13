import { HStack, VStack } from "@seed-design/react";
import type { ChatMessage } from "@/entities/chat/model/chatMessage";
import type { ChatSummary } from "@/entities/chat/model/chatSummary";
import type { Session } from "@/entities/session/model/session";
import { chatCopy } from "@/pages/chat/config/chatCopy";
import { chatScreenStyles } from "@/pages/chat/config/chatScreenStyles";
import BuildingChip from "@/pages/chat/ui/BuildingChip";
import ChatConversation from "@/pages/chat/ui/ChatConversation";
import ChatRail from "@/pages/chat/ui/ChatRail";
import ChatToolbar from "@/pages/chat/ui/ChatToolbar";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import Header from "@/widgets/header/ui/Header";
import HeaderBackButton from "@/widgets/header/ui/HeaderBackButton";

interface ChatPageProps {
	session: Session;
	currentPath: string;
	chatId: Nullable<number>;
	buildingId: Nullable<number>;
	buildingName: Nullable<string>;
	initialMessages: ChatMessage[];
	isLimitReached: boolean;
	chats: ChatSummary[];
	now: Date;
}

/**
 * 채팅 > 페이지
 *
 * - 뒤로 가기가 있는 로고 헤더 출력
 * - 1280 미만은 흰 열 안에 도구줄, 건물 칩, 대화, 질문 입력 바 출력
 * - 1280 이상은 하늘빛 배경 위 폭 1152 카드 안에 왼쪽 대화 목록 레일, 오른쪽 건물 칩, 대화, 질문 입력 바 출력
 * - 건물 이름이 있으면 도구줄 아래에 건물 칩 출력
 * - 새 대화와 지난 대화가 같은 화면을 씀
 *
 * @param chats 레일에 출력할 대화 목록
 * @param now 레일의 시각 표시에서 오늘과 어제를 정하는 기준
 */
export default function ChatPage({
	session,
	currentPath,
	chatId,
	buildingId,
	buildingName,
	initialMessages,
	isLimitReached,
	chats,
	now,
}: ChatPageProps) {
	const style = chatScreenStyles;

	return (
		<>
			<Header
				session={session}
				currentPath={currentPath}
				mobileBack={<HeaderBackButton />}
			/>
			<VStack as="main" data-area="main" {...style.main}>
				<HStack
					as="section"
					aria-label={chatCopy.title}
					data-area="chat-card"
					{...style.card}
				>
					<ChatRail chats={chats} now={now} chatId={chatId} />
					<VStack data-area="chat-pane" {...style.pane}>
						<ChatToolbar />
						{buildingName !== null && <BuildingChip name={buildingName} />}
						<ChatConversation
							chatId={chatId}
							buildingId={buildingId}
							initialMessages={initialMessages}
							isLimitReached={isLimitReached}
						/>
					</VStack>
				</HStack>
			</VStack>
		</>
	);
}
