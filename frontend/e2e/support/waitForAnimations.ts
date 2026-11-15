import type { Locator, Page } from "@playwright/test";

/**
 * 진행 중인 CSS 애니메이션과 전환이 끝날 때까지 기다림
 *
 * - 페이지를 받으면 문서 전체, 요소를 받으면 그 요소와 자손만 기다림
 * - 끝나지 않는 반복 애니메이션(커서 깜빡임 등)은 기다리지 않음
 * - 중간에 취소된 애니메이션은 끝난 것으로 봄
 */
export async function waitForAnimations(target: Page | Locator) {
	if ("goto" in target) {
		await target.evaluate(() =>
			Promise.all(
				document
					.getAnimations()
					.filter(
						(animation) =>
							animation.effect?.getComputedTiming().iterations !== Infinity,
					)
					.map((animation) => animation.finished.catch(() => undefined)),
			).then(() => undefined),
		);
		return;
	}
	await target.evaluate((element) =>
		Promise.all(
			element
				.getAnimations({ subtree: true })
				.filter(
					(animation) =>
						animation.effect?.getComputedTiming().iterations !== Infinity,
				)
				.map((animation) => animation.finished.catch(() => undefined)),
		).then(() => undefined),
	);
}
