import type { Page } from "@playwright/test";

/**
 * 화면 크기나 스크롤 변경 뒤 레이아웃이 반영될 때까지 두 프레임을 기다림
 *
 * - 일어나지 않아야 하는 일(이동 없음, 요청 없음)을 확인하기 전에도 씀
 */
export async function waitForFrames(page: Page) {
	await page.evaluate(
		() =>
			new Promise<void>((resolve) => {
				requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
			}),
	);
}
