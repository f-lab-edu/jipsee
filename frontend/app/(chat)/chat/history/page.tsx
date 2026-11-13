import type { Metadata, ResolvingMetadata } from "next";
import { redirect } from "next/navigation";
import { getChatList } from "@/entities/chat/api/getChatList";
import { getSession } from "@/entities/session/api/getSession";
import { chatCopy } from "@/pages/chat/config/chatCopy";
import ChatHistoryPage from "@/pages/chat/ui/ChatHistoryPage";
import { toPageMetadata } from "@/shared/lib/metadata/toPageMetadata";
import { paths } from "@/shared/routes/paths";

/**
 * 집사 > 대화 목록 메타데이터
 *
 * - 제목을 대화 목록으로 생성
 */
export async function generateMetadata(
	_props: PageProps<"/chat/history">,
	parent: ResolvingMetadata,
): Promise<Metadata> {
	return toPageMetadata(chatCopy.historyTitle, parent);
}

/**
 * 집사 > 대화 목록 페이지
 *
 * - 로그인하지 않은 상태면 돌아올 경로를 담아 로그인으로 이동
 * - 대화 목록을 조회해 페이지에 전달
 */
export default async function Page() {
	const session = await getSession();

	if (!session) {
		redirect(paths.loginWithNext(paths.chatHistory));
	}

	const chats = await getChatList();

	return <ChatHistoryPage session={session} chats={chats} now={new Date()} />;
}
