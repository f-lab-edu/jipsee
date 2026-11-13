import { C6_TOKENS } from "./c6Tokens";
import type { C10Measure } from "./c10MeasureNearby";
import { hexToRgb } from "./hexToRgb";
import type { T } from "./makeT";

export function c10CheckLabelStyle(t: T, m: C10Measure, label: string) {
	const tk = C6_TOKENS[t.theme];
	for (const g of m.groups ?? []) {
		t.eq(
			`${label} ${g.labelText} 라벨 글자 13/18 regular`,
			[g.label?.fs, g.label?.lh, g.label?.fw],
			["13px", "18px", "400"],
		);
		t.color(
			`${label} ${g.labelText} 라벨 색 fg.neutralMuted`,
			g.label?.color,
			hexToRgb(tk.fgMuted),
		);
	}
	if (m.area) {
		t.eq(
			`${label} 면적 라벨 글자 13/18 regular`,
			[m.area.label?.fs, m.area.label?.lh, m.area.label?.fw],
			["13px", "18px", "400"],
		);
		t.color(
			`${label} 면적 라벨 색 fg.neutralMuted`,
			m.area.label?.color,
			hexToRgb(tk.fgMuted),
		);
	}
}
