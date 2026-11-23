import { getApiUrl } from "@/shared/api/apiUrl";
import { fetchBackend } from "@/shared/api/fetchBackend";

/**
 * API > 백엔드 조회
 *
 * - 쿠키 없이 GET으로 서버에서 호출하고 응답을 상태와 상관없이 그대로 반환
 * - 호출에 실패하면 오류 발생
 */
export async function getFromBackend(path: string): Promise<Response> {
	const response = await fetchBackend(new Request(getApiUrl()), {
		method: "GET",
		path,
	});

	if (response === null) {
		throw new Error(`백엔드 호출 실패: ${path}`);
	}

	return response;
}
