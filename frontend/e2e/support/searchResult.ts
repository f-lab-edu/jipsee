import type { Locator, Page } from "@playwright/test";

type ResultLayout = "mobile" | "desktop";

/** 화면 폭에 맞는 검색 결과 레이아웃 래퍼와 그 안의 요소 */
export function searchResult(page: Page, layout: ResultLayout) {
	const root = page.getByTestId(`search-result-${layout}`);
	// 모바일은 li, 데스크톱은 머리 행을 뺀 데이터 행
	const items: Locator =
		layout === "mobile"
			? root.locator("li")
			: root
					.locator('[role="row"]')
					.filter({ has: page.locator('[role="cell"]') });

	return {
		root,
		items,
		moreButton: root.getByRole("button", { name: "더 보기" }),
		loadingButton: root.getByRole("button", { name: "불러오는 중" }),
		retryButton: root.getByRole("button", { name: "다시 시도" }),
		errorBand: root.getByRole("alert"),
		announcement: page.locator('[data-area="search-more-announcement"]'),
	};
}

/** 건물 번호가 같은 검색 결과 행 */
export function itemOf(items: Locator, id: number) {
	return items.filter({
		has: items.page().locator(`a[href="/buildings/${id}"]`),
	});
}
