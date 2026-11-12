import type { Page } from "@playwright/test";

/** 흰 세로 열(page-column), main, 모바일 헤더, body의 계산된 스타일과 폭을 읽어 반환함 */
export async function readColumn(page: Page) {
	return page.evaluate(() => {
		const column = document.querySelector('[data-area="page-column"]');
		const main = document.querySelector('[data-area="main"]');
		const header = document.querySelector('[data-area="header-mobile"]');
		if (!column || !main || !header?.firstElementChild) {
			throw new Error("열, 본문, 헤더 중 하나가 없음");
		}
		const columnStyle = getComputedStyle(column);
		const mainStyle = getComputedStyle(main);
		const columnBox = column.getBoundingClientRect();
		const mainBox = main.getBoundingClientRect();
		return {
			columnBackground: columnStyle.backgroundColor,
			bodyBackground: getComputedStyle(document.body).backgroundColor,
			headerBackground: getComputedStyle(header.firstElementChild)
				.backgroundColor,
			columnX: columnBox.x,
			columnWidth: columnBox.width,
			mainWidth: mainBox.width,
			mainBorderTopWidth: mainStyle.borderTopWidth,
			mainBorderRadius: mainStyle.borderTopLeftRadius,
			mainMarginLeft: mainStyle.marginLeft,
			mainMarginRight: mainStyle.marginRight,
			viewportWidth: window.innerWidth,
		};
	});
}
