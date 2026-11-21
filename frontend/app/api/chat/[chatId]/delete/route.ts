import { removeChat } from "@/entities/chat/api/removeChat";
import { getSession } from "@/entities/session/api/getSession";
import { redirectWithFormError } from "@/shared/api/redirectWithFormError";
import { rejectForeignOrigin } from "@/shared/api/rejectForeignOrigin";
import { toSameOriginReferer } from "@/shared/api/toSameOriginReferer";
import { phase2RoutesEnabled } from "@/shared/config/phase2Routes";
import { toPositiveId } from "@/shared/lib/ids/toPositiveId";
import { toDeleteRedirectPath } from "@/shared/lib/redirect/toDeleteRedirectPath";
import { paths } from "@/shared/routes/paths";

export const dynamic = "force-dynamic";

/**
 * API > 집사 대화 삭제
 *
 * - phase2RoutesEnabled가 false이면 404 반환
 * - 번호가 양의 정수가 아니면 404 반환
 * - 요청의 Origin이 SITE_URL의 출처와 다르거나 없으면 삭제하지 않고 실패로 처리
 * - 로그인하지 않았으면 로그인 화면으로 303 반환
 * - 삭제가 실패하면 실패로 처리
 * - 실패는 일반 텍스트 응답 대신 삭제 뒤 이동 경로로 error 쿼리(chat-delete-failed)를 붙여 303 반환
 * - 삭제 뒤 이동 경로는 같은 출처의 Referer로 정해 303 반환
 */
export async function POST(
	request: Request,
	{ params }: RouteContext<"/api/chat/[chatId]/delete">,
) {
	if (!phase2RoutesEnabled) {
		return new Response(null, { status: 404 });
	}

	const chatId = toPositiveId((await params).chatId);

	if (chatId === null) {
		return new Response(null, { status: 404 });
	}

	const redirectPath = toDeleteRedirectPath(
		toSameOriginReferer(request),
		chatId,
	);

	if (rejectForeignOrigin(request)) {
		return redirectWithFormError(redirectPath, "chat-delete-failed");
	}

	const session = await getSession();

	if (!session) {
		return new Response(null, {
			status: 303,
			headers: { location: paths.loginWithNext(redirectPath) },
		});
	}

	let setCookie: string | undefined;
	try {
		({ setCookie } = await removeChat(chatId));
	} catch {
		return redirectWithFormError(redirectPath, "chat-delete-failed");
	}

	const headers = new Headers({ location: redirectPath });

	if (setCookie) {
		headers.append("set-cookie", setCookie);
	}

	return new Response(null, { status: 303, headers });
}
