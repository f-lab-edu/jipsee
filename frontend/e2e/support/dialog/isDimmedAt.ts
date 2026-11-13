import type { Page } from "@playwright/test";

/**
 * 화면 좌표에서 딤이 페이지 요소보다 위에 쌓였는지 반환함
 *
 * - 겹친 요소를 위에서 아래 순서로 읽어 딤이나 확인 창 위치 지정자보다 먼저 페이지 요소가 나오면 딤이 덮지 못한 것
 * - 위치 지정자는 화면 전체를 덮어 맨 위 요소만으로는 딤이 헤더 아래인지 알 수 없음
 */
export async function isDimmedAt(
	page: Page,
	x: number,
	y: number,
): Promise<boolean> {
	return page.evaluate(
		({ pointX, pointY }) => {
			const overlay = '[class*="__backdrop"], [class*="__positioner"]';
			const stack = document.elementsFromPoint(pointX, pointY);
			const pageIndex = stack.findIndex((element) => !element.closest(overlay));
			const dimIndex = stack.findIndex((element) =>
				element.matches('[class*="__backdrop"]'),
			);
			return dimIndex !== -1 && dimIndex < pageIndex;
		},
		{ pointX: x, pointY: y },
	);
}
