import { C6_TOKENS } from "./c6Tokens";
import { C10_CHIPS, C10_NAMES, C10_TOKENS, type C10Cond } from "./c10Fixtures";
import type { C10Measure } from "./c10MeasureNearby";
import { hexToRgb } from "./hexToRgb";
import type { T } from "./makeT";

/** 칩 모양: 선택한 칩과 선택하지 않은 칩의 색, 굵기, 크기, 둥글기 */
export function c10CheckChipStyle(
	t: T,
	m: C10Measure,
	cond: C10Cond,
	label: string,
) {
	const tk = C6_TOKENS[t.theme];
	const k = C10_TOKENS[t.theme];
	C10_NAMES.forEach((name, gi) => {
		C10_CHIPS[name].forEach(([text, value], ci) => {
			const c = m.groups?.[gi]?.chips[ci];
			const sel = cond[name] === value;
			t.color(
				`${label} ${text} 배경 ${sel ? "bg.neutralSolid" : "bg.neutralWeak"}`,
				c?.bg,
				hexToRgb(sel ? k.neutralSolid : k.neutralWeak),
			);
			t.color(
				`${label} ${text} 글자색 ${sel ? "fg.onNeutralSolid" : "fg.neutral"}`,
				c?.color,
				sel ? hexToRgb(k.onNeutralSolid) : hexToRgb(tk.fgNeutral),
			);
			t.eq(
				`${label} ${text} 글자 14/20 ${sel ? "bold" : "medium"}`,
				[c?.fs, c?.lh, c?.fw],
				["14px", "20px", sel ? "700" : "500"],
			);
			t.near(`${label} ${text} 높이 36`, c?.rect.h, 36, 0.5);
			t.ok(
				`${label} ${text} 폭 48 이상(최소 폭 48, border-box 기준)`,
				(c?.rect.w ?? 0) >= 47.5,
				c?.rect.w,
				"≥ 48",
			);
			t.eq(`${label} ${text} padding 좌우 12`, c?.pad, "0px 12px 0px 12px");
			t.ok(
				`${label} ${text} 둥글기 full(알약)`,
				(c?.radius ?? 0) >= 18,
				c?.radius,
				"≥ 18",
			);
		});
	});
}
