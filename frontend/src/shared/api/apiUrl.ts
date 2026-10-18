export function getApiUrl(): string {
	const url = process.env.API_URL;
	if (!url) {
		throw new Error("API_URL 환경 변수 미설정");
	}
	return url;
}
