import type { Page } from "@playwright/test";
import { searchForm } from "./searchForm";
import { waitForQuiet } from "./waitForQuiet";

/** 검색 폼을 제출하고 이동 여부를 관찰할 수 있도록 화면과 네트워크가 가라앉을 때까지 기다림 */
export async function submitSearch(page: Page, how: "button" | "enter") {
	const { input, submitButton } = searchForm(page);
	if (how === "button") {
		await submitButton.click();
	} else {
		await input.press("Enter");
	}
	await waitForQuiet(page);
}
