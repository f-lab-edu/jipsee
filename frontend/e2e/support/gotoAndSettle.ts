import type { Page } from "@playwright/test";
import { waitForHydration } from "./waitForHydration";

/** 페이지를 열고 하이드레이션이 끝나도록 기다림. 응답 상태 코드를 반환함 */
export async function gotoAndSettle(page: Page, path: string) {
	const response = await page.goto(path, { waitUntil: "load" });
	await waitForHydration(page);
	return response ? response.status() : 0;
}
