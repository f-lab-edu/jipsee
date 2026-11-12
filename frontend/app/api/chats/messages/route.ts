import { postChatMessage } from "@/entities/chat/api/postChatMessage";
import { getSession } from "@/entities/session/api/getSession";

export const dynamic = "force-dynamic";

/**
 * API > 집사 질문 전송
 *
 * - 로그인하지 않았으면 401 반환
 */
export async function POST(request: Request) {
	const session = await getSession();

	if (!session) {
		return new Response(null, { status: 401 });
	}

	return postChatMessage(request);
}
