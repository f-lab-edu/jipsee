import type { Page } from "@playwright/test";

/** 화면에 보이는 검색 폼의 입력창과 제출 버튼 */
export function searchForm(page: Page) {
	const form = page.locator('form[role="search"]:visible').first();
	return {
		input: form.getByLabel("건물 검색"),
		submitButton: form.locator('button[type="submit"]:visible').first(),
	};
}
