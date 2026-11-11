import {
	C10_LABELS,
	C10_NAMES,
	C10_OPTIONS,
	type C10Cond,
} from "./c10Fixtures";
import type { T } from "./makeT";

/** 선택지 목록: 선택 상자를 누르면 목록이 열리고, 선택지 문구와 순서가 같고, 지금 값만 선택된 상태이고, Escape로 닫힘. 2026-11-09 피드백 9번 */
export async function c10CheckOptions(t: T, cond: C10Cond, label: string) {
	for (const name of C10_NAMES) {
		const trigger = t.page.getByRole("combobox", { name: C10_LABELS[name] });
		await trigger.click();
		const options = t.page.getByRole("option");
		await options.first().waitFor();
		t.eq(
			`${label} ${C10_LABELS[name]} 선택 상자가 열림`,
			await trigger.getAttribute("aria-expanded"),
			"true",
		);
		t.eq(
			`${label} ${C10_LABELS[name]} 선택지 문구와 순서`,
			await options.allTextContents(),
			C10_OPTIONS[name].map(([text]) => text),
		);
		t.eq(
			`${label} ${C10_LABELS[name]} 선택된 선택지`,
			await options.evaluateAll((nodes) =>
				nodes
					.filter((n) => n.getAttribute("aria-selected") === "true")
					.map((n) => n.textContent),
			),
			C10_OPTIONS[name]
				.filter(([, value]) => value === cond[name])
				.map(([text]) => text),
		);
		await t.page.keyboard.press("Escape");
		await t.page.waitForTimeout(300);
		t.eq(
			`${label} ${C10_LABELS[name]} Escape로 닫힘`,
			await trigger.getAttribute("aria-expanded"),
			"false",
		);
	}
}
