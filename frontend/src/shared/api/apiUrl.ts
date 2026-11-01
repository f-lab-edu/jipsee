/** API_URL 환경 변수를 반환하고, 설정되어 있지 않으면 오류를 던짐 */
export function getApiUrl(): string {
	const url = process.env.API_URL;
	if (!url) {
		throw new Error("API_URL 환경 변수 미설정");
	}
	return url;
}
