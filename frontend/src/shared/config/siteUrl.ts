/**
 * 사이트 > 주소 조회
 *
 * - SITE_URL 환경 변수 반환
 * - 설정되어 있지 않으면 오류 발생
 */
export function getSiteUrl(): string {
	const url = process.env.SITE_URL;
	if (!url) {
		throw new Error("SITE_URL 환경 변수 미설정");
	}
	return url;
}
