import type { Page } from "@playwright/test";
import { searchForm } from "./searchForm";

/** 검색 폼 제출 후 이동 여부를 관찰할 수 있도록 잠시 기다림 */
export async function submitSearch(page: Page, how: "button" | "enter") {
	const { input, submitButton } = searchForm(page);
	if (how === "button") {
		await submitButton.click();
	} else {
		await input.press("Enter");
	}
	await page.waitForTimeout(800);
}
