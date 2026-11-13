import type { Page } from "@playwright/test";

/** 질문 입력에 값을 넣고 Enter로 보냄 */
export async function sendQuestion(page: Page, question: string) {
	const input = page.getByLabel("집사에게 질문");
	await input.fill(question);
	await input.press("Enter");
}
