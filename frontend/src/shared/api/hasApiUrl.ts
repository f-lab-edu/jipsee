/**
 * API > 주소 설정 여부 조회
 *
 * - API_URL 환경 변수가 비어 있지 않으면 true 반환
 */
export function hasApiUrl(): boolean {
	return Boolean(process.env.API_URL);
}
