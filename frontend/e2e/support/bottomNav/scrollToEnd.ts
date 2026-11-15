import type { Page } from "@playwright/test";
import { waitForFrames } from "../waitForFrames";

/** 페이지 맨 아래까지 스크롤하고 sticky 위치가 정해지도록 프레임을 기다림 */
export async function scrollToEnd(page: Page) {
	await page.evaluate(() =>
		window.scrollTo(0, document.documentElement.scrollHeight),
	);
	await waitForFrames(page);
}
