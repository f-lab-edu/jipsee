import type { Page } from "@playwright/test";

/** 페이지를 열고 하이드레이션이 끝나도록 잠시 기다림 */
export async function gotoAndSettle(page: Page, path: string) {
	await page.goto(path, { waitUntil: "load" });
	await page.waitForTimeout(700);
}
