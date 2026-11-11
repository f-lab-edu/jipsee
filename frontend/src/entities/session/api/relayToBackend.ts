import type { BackendPath } from "@/entities/session/model/backendPath";
import { getApiUrl } from "@/shared/api/apiUrl";
import { paths } from "@/shared/routes/paths";

/**
 * 세션 > 백엔드 호출 중계
 *
 * - 요청의 Origin이 요청 주소와 다른 출처이거나 없으면 403 반환
 * - API_URL을 읽지 못하면 500 반환
 * - 호출에 실패하거나 응답이 2xx, 3xx가 아니면 502 반환
 * - 성공하면 백엔드의 Set-Cookie를 모두 옮겨 담고 홈으로 303 반환
 * - 쿠키 삭제가 302 응답에 실리므로 리다이렉트를 따라가지 않음
 */
export async function relayToBackend(
	request: Request,
	target: BackendPath,
): Promise<Response> {
	if (request.headers.get("origin") !== new URL(request.url).origin) {
		return new Response("요청 출처가 이 사이트와 달라 거부함", { status: 403 });
	}

	let apiUrl: string;
	try {
		apiUrl = getApiUrl();
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "API_URL을 읽지 못함";
		return new Response(message, { status: 500 });
	}

	const cookie = request.headers.get("cookie");
	let upstream: Response;
	try {
		upstream = await fetch(`${apiUrl}${target.path}`, {
			method: target.method,
			headers: cookie ? { cookie } : {},
			redirect: "manual",
			cache: "no-store",
			signal: AbortSignal.timeout(3000),
		});
	} catch {
		return new Response("API 호출에 실패함", { status: 502 });
	}

	if (upstream.status < 200 || upstream.status >= 400) {
		return new Response("API 호출에 실패함", { status: 502 });
	}

	const headers = new Headers({ location: paths.home });
	for (const setCookie of upstream.headers.getSetCookie()) {
		headers.append("set-cookie", setCookie);
	}
	return new Response(null, { status: 303, headers });
}
