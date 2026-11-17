import type { Page } from "@playwright/test";
import { waitForFrames } from "./waitForFrames";

/**
 * 일어나지 않아야 하는 일(이동 없음, 요청 없음, 말풍선 없음)을 확인하기 전에 화면과 네트워크가 가라앉을 때까지 기다림
 *
 * - 시간을 정해 두고 기다리지 않음
 */
export async function waitForQuiet(page: Page) {
	await waitForFrames(page);
	await page.waitForLoadState("networkidle");
}
