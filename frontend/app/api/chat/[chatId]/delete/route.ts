import { removeChat } from "@/entities/chat/api/removeChat";
import { getSession } from "@/entities/session/api/getSession";
import { rejectForeignOrigin } from "@/shared/api/rejectForeignOrigin";
import { toPositiveId } from "@/shared/lib/ids/toPositiveId";
import { toDeleteRedirectPath } from "@/shared/lib/redirect/toDeleteRedirectPath";

export const dynamic = "force-dynamic";

/**
 * API > 집사 대화 삭제
 *
 * - 요청의 Origin이 SITE_URL의 출처와 다르거나 없으면 403 반환
 * - 로그인하지 않았으면 401 반환
 * - 번호가 양의 정수가 아니면 404 반환
 * - 삭제 뒤 이동 경로는 Referer로 정해 303 반환
 */
export async function POST(
	request: Request,
	{ params }: RouteContext<"/api/chat/[chatId]/delete">,
) {
	const rejection = rejectForeignOrigin(request);
	if (rejection) {
		return rejection;
	}

	const session = await getSession();

	if (!session) {
		return new Response(null, { status: 401 });
	}

	const chatId = toPositiveId((await params).chatId);

	if (chatId === null) {
		return new Response(null, { status: 404 });
	}

	const { setCookie } = await removeChat(chatId);
	const headers = new Headers({
		location: toDeleteRedirectPath(request.headers.get("referer"), chatId),
	});

	if (setCookie) {
		headers.append("set-cookie", setCookie);
	}

	return new Response(null, { status: 303, headers });
}
