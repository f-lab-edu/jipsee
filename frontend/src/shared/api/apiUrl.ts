/**
 * API > 주소 조회
 *
 * - API_URL 환경 변수 반환
 * - 설정되어 있지 않으면 오류 발생
 */
export function getApiUrl(): string {
	const url = process.env.API_URL;
	if (!url) {
		throw new Error("API_URL 환경 변수 미설정");
	}
	return url;
}
