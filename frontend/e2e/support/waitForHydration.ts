import type { Page } from "@playwright/test";

/**
 * 하이드레이션과 글꼴 로딩이 끝날 때까지 기다림
 *
 * - 링크, 버튼, 입력, 폼이 모두 React 파이버를 가질 때까지 기다림
 * - 시간을 정해 두고 기다리지 않음
 */
export async function waitForHydration(page: Page) {
	await page.waitForFunction(() =>
		Array.from(
			document.body.querySelectorAll("a, button, input, textarea, form"),
		).every((element) =>
			Object.keys(element).some((key) => key.startsWith("__reactFiber$")),
		),
	);
	await page.evaluate(() => document.fonts.ready.then(() => undefined));
}
