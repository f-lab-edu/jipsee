import type { Page } from "@playwright/test";

/** keyword 쿼리가 붙은 요청 주소를 모음. prefetch는 쿼리가 없어 제외됨 */
export function watchKeywordRequests(page: Page) {
	const urls: string[] = [];
	page.on("request", (request) => {
		if (/[?&]keyword=/.test(request.url())) urls.push(request.url());
	});
	return urls;
}
