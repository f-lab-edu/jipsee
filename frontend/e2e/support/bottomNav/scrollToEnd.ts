import type { Page } from "@playwright/test";

/** 페이지 맨 아래까지 스크롤하고 sticky 위치가 정해지도록 잠시 기다림 */
export async function scrollToEnd(page: Page) {
	await page.evaluate(() =>
		window.scrollTo(0, document.documentElement.scrollHeight),
	);
	await page.waitForTimeout(200);
}
