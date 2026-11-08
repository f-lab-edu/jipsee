import { expect, type Page } from "@playwright/test";
import { collectConsoleIssues } from "../collectConsoleIssues";
import { gotoAndSettle } from "../gotoAndSettle";
import { type BuildingMeasure, measure } from "./measure";
import { type InfoMeasure, measureInfo } from "./measureInfo";
import { sameColor } from "./sameColor";
import { type Theme, TOKENS } from "./tokens";

const fmt = (value: unknown) => JSON.stringify(value);

export type T = {
	page: Page;
	theme: Theme;
	tokens: (typeof TOKENS)[Theme];
	/** 콘솔 오류, hydration 경고, pageerror 모음. 라우트별로 비우고 읽을 수 있음 */
	issues: string[];
	fail: (message: string) => void;
	eq: (label: string, actual: unknown, expected: unknown) => void;
	near: (
		label: string,
		actual: number | undefined,
		expected: number | undefined,
		tol?: number,
	) => void;
	color: (
		label: string,
		actual: string | null | undefined,
		expected: string | null | undefined,
	) => void;
	ok: (label: string, cond: boolean, actual: unknown, expected: string) => void;
	goto: (path: string, settleMs?: number) => Promise<number>;
	measure: () => Promise<BuildingMeasure>;
	measureInfo: () => Promise<InfoMeasure>;
};

/** 원본 TC 스크립트의 t 객체에 해당함. 검사는 모두 expect.soft로 모아서 테스트 끝에서 한꺼번에 실패시킴 */
export function makeT(page: Page, theme: Theme): T {
	const issues = collectConsoleIssues(page);

	return {
		page,
		theme,
		tokens: TOKENS[theme],
		issues,
		fail: (message) => {
			expect.soft(false, message).toBe(true);
		},
		eq: (label, actual, expected) => {
			expect.soft(actual, label).toEqual(expected);
		},
		near: (label, actual, expected, tol = 1) => {
			const within =
				typeof actual === "number" &&
				typeof expected === "number" &&
				Math.abs(actual - expected) <= tol;
			expect
				.soft(
					within,
					`${label}: actual=${fmt(actual)} expected=${expected}±${tol}`,
				)
				.toBe(true);
		},
		color: (label, actual, expected) => {
			expect
				.soft(
					sameColor(actual, expected),
					`${label}: actual=${actual} expected=${expected}`,
				)
				.toBe(true);
		},
		ok: (label, cond, actual, expected) => {
			expect
				.soft(cond, `${label}: actual=${fmt(actual)} expected=${expected}`)
				.toBe(true);
		},
		goto: (path, settleMs) => gotoAndSettle(page, path, settleMs),
		measure: () => page.evaluate(measure),
		measureInfo: () => page.evaluate(measureInfo),
	};
}
