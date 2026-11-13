import type { Locator } from "@playwright/test";

/** 말풍선 요소의 배경, 글자색, 네 모서리와 폭을 읽어 반환함 */
export async function readChatBubble(locator: Locator) {
	return locator.first().evaluate((element) => {
		const style = getComputedStyle(element);
		return {
			background: style.backgroundColor,
			color: style.color,
			radius: [
				style.borderTopLeftRadius,
				style.borderTopRightRadius,
				style.borderBottomRightRadius,
				style.borderBottomLeftRadius,
			].join(" "),
			width: element.getBoundingClientRect().width,
		};
	});
}
