import type { Page } from "@playwright/test";

/** main(카드)과 body의 계산된 스타일과 폭을 읽어 반환함 */
export async function readCard(page: Page) {
	return page
		.locator('[data-area="main"]')
		.first()
		.evaluate((element) => {
			const computed = getComputedStyle(element);
			const box = element.getBoundingClientRect();
			return {
				borderTopWidth: computed.borderTopWidth,
				borderRadius: computed.borderTopLeftRadius,
				marginLeft: computed.marginLeft,
				marginRight: computed.marginRight,
				backgroundColor: computed.backgroundColor,
				bodyBackground: getComputedStyle(document.body).backgroundColor,
				width: box.width,
			};
		});
}
