import type { Locator } from "@playwright/test";

/** 첫 요소의 화면 위치와 크기를 반환함. 요소가 없으면 실패시킴 */
export async function readBox(locator: Locator) {
	const box = await locator.first().boundingBox();
	if (!box) {
		throw new Error("요소가 화면에 없음");
	}
	return box;
}
