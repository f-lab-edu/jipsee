import type { Locator, Page } from "@playwright/test";

/** 요소의 아래, 위 테두리 두께와 색, 그림자를 읽어 반환함 */
async function readEdge(locator: Locator) {
	return locator.first().evaluate((element) => {
		const style = getComputedStyle(element);
		return {
			borderBottomWidth: style.borderBottomWidth,
			borderBottomColor: style.borderBottomColor,
			borderTopWidth: style.borderTopWidth,
			borderTopColor: style.borderTopColor,
			boxShadow: style.boxShadow,
		};
	});
}

/** 모바일 헤더(바깥 래퍼의 첫 자식)의 가장자리 값 */
export function readHeaderEdge(page: Page) {
	return readEdge(page.locator('[data-area="header-mobile"] > *'));
}

/** 홈 모바일 챗봇 패널의 가장자리 값 */
export function readChatPanelEdge(page: Page) {
	return readEdge(page.locator('[data-area="chat-panel-mobile"]'));
}

/** 데스크톱 헤더(바깥 래퍼의 첫 자식)의 그림자 값 */
export function readDesktopHeaderEdge(page: Page) {
	return readEdge(page.locator('[data-area="header-desktop"] > *'));
}
