import { test as base, expect } from "@playwright/test";

/** 콘솔 오류, hydration 경고, pageerror가 있으면 테스트 끝에서 실패함 */
export const test = base.extend<{ consoleIssues: undefined }>({
	consoleIssues: [
		async ({ page }, use) => {
			const issues: string[] = [];
			page.on("console", (message) => {
				const text = message.text();
				if (/Failed to load resource/.test(text)) return;
				const isHydrationWarning =
					message.type() === "warning" && /hydrat/i.test(text);
				if (message.type() === "error" || isHydrationWarning) {
					issues.push(`${message.type()}: ${text.slice(0, 200)}`);
				}
			});
			page.on("pageerror", (error) => {
				issues.push(`pageerror: ${error.message.slice(0, 200)}`);
			});
			await use(undefined);
			expect(issues).toEqual([]);
		},
		{ auto: true },
	],
});
