import { postChatMessage } from "@/entities/chat/api/postChatMessage";
import { getSession } from "@/entities/session/api/getSession";
import { rejectForeignOrigin } from "@/shared/api/rejectForeignOrigin";

export const dynamic = "force-dynamic";

/**
 * API > 집사 질문 전송
 *
 * - 요청의 Origin이 SITE_URL의 출처와 다르거나 없으면 403 반환
 * - 로그인하지 않았으면 401 반환
 */
export async function POST(request: Request) {
	const rejection = rejectForeignOrigin(request);
	if (rejection) {
		return rejection;
	}

	const session = await getSession();

	if (!session) {
		return new Response(null, { status: 401 });
	}

	return postChatMessage(request);
}
