import { test as base, expect } from "@playwright/test";
import { makeT, type T } from "./buildingDetail/makeT";
import { collectConsoleIssues } from "./collectConsoleIssues";

/**
 * - consoleIssues: 콘솔 오류, hydration 경고, pageerror가 있으면 테스트 끝에서 실패함
 * - t: 건물 상세 검사용 객체. 테마는 test.use의 colorScheme을 따름
 */
export const test = base.extend<{ consoleIssues: undefined; t: T }>({
	t: async ({ page, colorScheme }, use) => {
		await use(makeT(page, colorScheme === "dark" ? "dark" : "light"));
	},
	consoleIssues: [
		async ({ page }, use) => {
			const issues = collectConsoleIssues(page);
			await use(undefined);
			expect(issues).toEqual([]);
		},
		{ auto: true },
	],
});
