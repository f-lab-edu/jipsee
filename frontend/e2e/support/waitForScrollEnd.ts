import type { Page } from "@playwright/test";

/** 스크롤 위치가 세 프레임 연속으로 바뀌지 않을 때까지 기다림 */
export async function waitForScrollEnd(page: Page) {
	await page.evaluate(
		() =>
			new Promise<void>((resolve) => {
				let last = window.scrollY;
				let stableFrames = 0;
				const tick = () => {
					if (window.scrollY === last) {
						stableFrames += 1;
					} else {
						stableFrames = 0;
						last = window.scrollY;
					}
					if (stableFrames >= 3) {
						resolve();
						return;
					}
					requestAnimationFrame(tick);
				};
				requestAnimationFrame(tick);
			}),
	);
}
