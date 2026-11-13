import { C6_TOKENS } from "./c6Tokens";
import { C10_AREA } from "./c10Fixtures";
import type { C10Measure } from "./c10MeasureNearby";
import { hexToRgb } from "./hexToRgb";
import type { T } from "./makeT";

/** 면적 고정 줄: 문구, 잠금 아이콘 14, 아이콘과 문구 간격 6, 글자 14/20 fg.neutral */
export function c10CheckAreaRow(t: T, m: C10Measure, label: string) {
	const tk = C6_TOKENS[t.theme];
	const a = m.area;
	t.eq(`${label} 면적 고정 문구`, a?.text, C10_AREA);
	t.ok(`${label} 면적 라벨이 있음`, !!a?.label, a?.label, "있음");
	t.eq(
		`${label} 문구 글자 14/20 regular`,
		[a?.fs, a?.lh, a?.fw],
		["14px", "20px", "400"],
	);
	t.color(`${label} 문구 색 fg.neutral`, a?.color, hexToRgb(tk.fgNeutral));
	t.near(`${label} 잠금 아이콘 w 14`, a?.svg?.rect.w, 14, 0.5);
	t.near(`${label} 잠금 아이콘 h 14`, a?.svg?.rect.h, 14, 0.5);
	t.near(
		`${label} 아이콘과 문구 간격 6`,
		(a?.rect.x ?? Number.NaN) - (a?.svg?.rect.r ?? Number.NaN),
		6,
		1,
	);
	t.near(
		`${label} 아이콘 세로 가운데가 문구 가운데와 같음`,
		(a?.svg?.rect.y ?? Number.NaN) + 7,
		(a?.rect.y ?? Number.NaN) + (a?.rect.h ?? 0) / 2,
		1.5,
	);
	t.color(
		`${label} 아이콘 색 fg.neutral`,
		a?.svg?.color,
		hexToRgb(tk.fgNeutral),
	);
	t.eq(`${label} 아이콘 aria-hidden`, a?.svg?.ariaHidden, "true");
	t.near(
		`${label} 라벨과 아이콘 시작 간격 8`,
		(a?.svg?.rect.x ?? Number.NaN) -
			((a?.label?.rect.x ?? Number.NaN) + (a?.label?.cellW ?? Number.NaN)),
		8,
		1,
	);
}
