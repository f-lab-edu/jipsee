import { getApiUrl } from "@/shared/api/apiUrl";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

/**
 * API > 백엔드 호출
 *
 * - 요청의 Cookie를 실어 API_URL과 경로로 호출
 * - 3초 안에 응답이 없거나 호출에 실패하면 null 반환
 * - 리다이렉트를 따라가지 않고 응답을 그대로 반환
 * - API_URL을 읽지 못하면 오류 발생
 */
export async function fetchBackend(
	request: Request,
	target: { method: string; path: string },
): Promise<Nullable<Response>> {
	const apiUrl = getApiUrl();
	const cookie = request.headers.get("cookie");

	try {
		return await fetch(`${apiUrl}${target.path}`, {
			method: target.method,
			headers: cookie ? { cookie } : {},
			redirect: "manual",
			cache: "no-store",
			signal: AbortSignal.timeout(3000),
		});
	} catch {
		return null;
	}
}
