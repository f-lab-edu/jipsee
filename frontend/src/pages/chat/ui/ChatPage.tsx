import { VStack } from "@seed-design/react";
import type { ChatMessage } from "@/entities/chat/model/chatMessage";
import type { Session } from "@/entities/session/model/session";
import { chatCopy } from "@/pages/chat/config/chatCopy";
import { chatScreenStyles } from "@/pages/chat/config/chatScreenStyles";
import BuildingChip from "@/pages/chat/ui/BuildingChip";
import ChatConversation from "@/pages/chat/ui/ChatConversation";
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
}

/**
 * 채팅 > 페이지
 *
 * - 뒤로 가기가 있는 로고 헤더 출력
 * - 1280 미만은 흰 열 안에, 1280 이상은 하늘빛 배경 위 폭 720 카드 안에 도구줄, 건물 칩, 대화, 질문 입력 바 출력
 * - 건물 이름이 있으면 도구줄 아래에 건물 칩 출력
 * - 새 대화와 지난 대화가 같은 화면을 씀
 */
export default function ChatPage({
	session,
	currentPath,
	chatId,
	buildingId,
	buildingName,
	initialMessages,
	isLimitReached,
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
				<VStack
					as="section"
					aria-label={chatCopy.title}
					data-area="chat-card"
					{...style.card}
				>
					<ChatToolbar />
					{buildingName !== null && <BuildingChip name={buildingName} />}
					<ChatConversation
						chatId={chatId}
						buildingId={buildingId}
						initialMessages={initialMessages}
						isLimitReached={isLimitReached}
					/>
				</VStack>
			</VStack>
		</>
	);
}
