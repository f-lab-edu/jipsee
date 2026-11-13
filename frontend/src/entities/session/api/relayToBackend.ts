import type { BackendPath } from "@/entities/session/model/backendPath";
import { fetchBackend } from "@/shared/api/fetchBackend";
import { rejectForeignOrigin } from "@/shared/api/rejectForeignOrigin";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import { paths } from "@/shared/routes/paths";

/**
 * 세션 > 백엔드 호출 중계
 *
 * - 요청의 Origin이 SITE_URL의 출처와 다르거나 없으면 403 반환
 * - API_URL을 읽지 못하면 500 반환
 * - 호출에 실패하면 502 반환
 * - 백엔드가 401, 403을 주면 세션이 없는 것이므로 로그인 화면으로 303 반환
 * - 2xx이면 성공으로 보고 3xx는 acceptsRedirect인 경로에서만 성공으로 봄
 * - 그 밖의 응답은 502 반환
 * - 성공하면 백엔드의 Set-Cookie를 모두 옮겨 담고 홈으로 303 반환
 * - 쿠키 삭제가 302 응답에 실리므로 리다이렉트를 따라가지 않음
 */
export async function relayToBackend(
	request: Request,
	target: BackendPath,
): Promise<Response> {
	const rejection = rejectForeignOrigin(request);
	if (rejection) {
		return rejection;
	}

	let upstream: Nullable<Response>;
	try {
		upstream = await fetchBackend(request, target);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "API_URL을 읽지 못함";
		return new Response(message, { status: 500 });
	}

	if (upstream === null) {
		return new Response("API 호출에 실패함", { status: 502 });
	}

	if (upstream.status === 401 || upstream.status === 403) {
		return new Response(null, {
			status: 303,
			headers: { location: paths.loginWithNext(paths.me) },
		});
	}

	const isRedirect = upstream.status >= 300 && upstream.status < 400;
	if (!upstream.ok && !(isRedirect && target.acceptsRedirect)) {
		return new Response("API 호출에 실패함", { status: 502 });
	}

	const headers = new Headers({ location: paths.home });
	for (const setCookie of upstream.headers.getSetCookie()) {
		headers.append("set-cookie", setCookie);
	}
	return new Response(null, { status: 303, headers });
}
