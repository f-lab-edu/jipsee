import { removeChat } from "@/entities/chat/api/removeChat";
import { getSession } from "@/entities/session/api/getSession";
import { toPositiveId } from "@/pages/chat/lib/toPositiveId";

export const dynamic = "force-dynamic";

/**
 * API > 집사 대화 삭제
 *
 * - 로그인하지 않았으면 401 반환
 * - 번호가 양의 정수가 아니면 404 반환
 */
export async function POST(
	_request: Request,
	{ params }: RouteContext<"/api/chat/[chatId]/delete">,
) {
	const session = await getSession();

	if (!session) {
		return new Response(null, { status: 401 });
	}

	const chatId = toPositiveId((await params).chatId);

	if (chatId === null) {
		return new Response(null, { status: 404 });
	}

	return removeChat(chatId);
}
