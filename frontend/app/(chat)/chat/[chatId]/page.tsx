import type { Metadata, ResolvingMetadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getChat } from "@/entities/chat/api/getChat";
import { getChatLimit } from "@/entities/chat/api/getChatLimit";
import { getSession } from "@/entities/session/api/getSession";
import { chatCopy } from "@/pages/chat/config/chatCopy";
import { toPositiveId } from "@/pages/chat/lib/toPositiveId";
import ChatPage from "@/pages/chat/ui/ChatPage";
import { toPageMetadata } from "@/shared/lib/metadata/toPageMetadata";
import { paths } from "@/shared/routes/paths";

/**
 * 집사 > 지난 대화 메타데이터
 *
 * - 제목을 집사로 생성
 */
export async function generateMetadata(
	_props: PageProps<"/chat/[chatId]">,
	parent: ResolvingMetadata,
): Promise<Metadata> {
	return toPageMetadata(chatCopy.title, parent);
}

/**
 * 집사 > 지난 대화 페이지
 *
 * - 로그인하지 않은 상태면 돌아올 경로를 담아 로그인으로 이동
 * - 번호가 양의 정수가 아니거나 없는 대화이면 404
 * - 대화의 이전 메시지와 건물 기준을 페이지에 전달
 */
export default async function Page({ params }: PageProps<"/chat/[chatId]">) {
	const { chatId: rawChatId } = await params;
	const session = await getSession();

	if (!session) {
		redirect(paths.loginWithNext(`${paths.chat}/${rawChatId}`));
	}

	const chatId = toPositiveId(rawChatId);

	if (chatId === null) {
		notFound();
	}

	const chat = await getChat(chatId);

	if (chat === null) {
		notFound();
	}

	const { dailyLimitReached } = await getChatLimit();

	return (
		<ChatPage
			session={session}
			currentPath={paths.chatDetail(chatId)}
			chatId={chat.id}
			buildingId={chat.buildingId}
			buildingName={chat.buildingName}
			initialMessages={chat.messages}
			isLimitReached={dailyLimitReached}
		/>
	);
}
