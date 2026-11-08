import { C6_TOKENS } from "./c6Tokens";
import { c11Bounds } from "./c11Bounds";
import { C11_TOKENS } from "./c11Fixtures";
import type { C11Measure } from "./c11Measure";
import { c12Notices } from "./c12Notices";
import { hexToRgb } from "./hexToRgb";
import type { T } from "./makeT";

/** 모바일 목록: li 구조, 행 높이와 padding, 구분선, 건물명, 칩, 날짜, 면적, 금액 */
export function c11CheckMobileRows(t: T, m: C11Measure, label: string) {
	const tk = C6_TOKENS[t.theme];
	const k = C11_TOKENS[t.theme];
	const b = c11Bounds(m, "mobile");
	m.lis.forEach((r, i) => {
		const l = `${label} ${i + 1}행`;
		const [name, chipT, date, area, amount] = r.texts;
		if (!name || !chipT || !date || !area || !amount) {
			t.fail(`${l} 글자 칸이 다섯 개가 아님`);
			return;
		}
		t.near(`${l} x`, r.rect.x, b.l, 0.5);
		t.near(`${l} w`, r.rect.w, b.r - b.l, 0.5);
		t.near(`${l} 높이 73(14 + 22 + 4 + 18 + 14 + 구분선 1)`, r.rect.h, 73, 0.5);
		t.eq(`${l} 위아래 padding 14`, r.pad, "14px 14px");
		t.eq(`${l} 구분선 아래쪽 1px solid`, [r.bbw, r.bbs], ["1px", "solid"]);
		t.color(`${l} 구분선 색 stroke.neutralMuted`, r.bbc, t.tokens.strokeMuted);
		const before = m.lis[i - 1];
		if (before) t.near(`${l} 앞 행 바로 아래`, r.rect.y, before.rect.b, 0.5);
		t.eq(
			`${l} 건물명 글자 15/22 bold`,
			[name.fs, name.lh, name.fw],
			["15px", "22px", "700"],
		);
		t.color(`${l} 건물명 색 fg.neutral`, name.color, hexToRgb(tk.fgNeutral));
		t.near(`${l} 건물명 x`, name.x, b.l, 0.5);
		t.near(
			`${l} 건물명 세로 가운데(행 위 + 14 + 11)`,
			name.y + name.h / 2,
			r.rect.y + 25,
			1.5,
		);
		t.near(`${l} 칩 상자 x`, r.chip?.x, b.l, 0.5);
		t.near(
			`${l} 칩 상자 y(행 위 + 14 + 22 + 4)`,
			r.chip?.y,
			r.rect.y + 40,
			0.5,
		);
		t.near(`${l} 칩 상자 높이 18(padding 2 + 14 + 2)`, r.chip?.h, 18, 0.5);
		t.eq(
			`${l} 칩 padding 2/6, 둥글기 4`,
			[r.chip?.pad, r.chip?.radius],
			["2px 6px 2px 6px", "4px"],
		);
		t.color(`${l} 칩 배경 bg.neutralWeak`, r.chip?.bg, hexToRgb(k.neutralWeak));
		t.eq(
			`${l} 칩 글자 11/14 medium`,
			[chipT.fs, chipT.lh, chipT.fw],
			["11px", "14px", "500"],
		);
		t.color(
			`${l} 칩 글자색 fg.neutralMuted`,
			chipT.color,
			hexToRgb(tk.fgMuted),
		);
		t.near(
			`${l} 칩 글자 x(칩 x + 6)`,
			chipT.x,
			(r.chip?.x ?? Number.NaN) + 6,
			1,
		);
		t.near(
			`${l} 날짜 x(칩 오른쪽 + 8)`,
			date.x,
			(r.chip?.r ?? Number.NaN) + 8,
			1,
		);
		t.near(`${l} 면적 x(날짜 오른쪽 + 8)`, area.x, date.r + 8, 1);
		t.eq(
			`${l} 날짜 글자 13/18 regular`,
			[date.fs, date.lh, date.fw],
			["13px", "18px", "400"],
		);
		t.eq(
			`${l} 면적 글자 13/18 regular`,
			[area.fs, area.lh, area.fw],
			["13px", "18px", "400"],
		);
		t.color(`${l} 날짜 색 fg.neutralMuted`, date.color, hexToRgb(tk.fgMuted));
		t.color(`${l} 면적 색 fg.neutralMuted`, area.color, hexToRgb(tk.fgMuted));
		t.near(`${l} 날짜와 면적 같은 줄`, date.y, area.y, 0.5);
		t.near(
			`${l} 칩이 날짜와 세로 가운데`,
			(r.chip?.y ?? Number.NaN) + (r.chip?.h ?? 0) / 2,
			date.y + date.h / 2,
			1.5,
		);
		t.eq(
			`${l} 금액 글자 15/22 bold`,
			[amount.fs, amount.lh, amount.fw],
			["15px", "22px", "700"],
		);
		t.color(`${l} 금액 색 fg.neutral`, amount.color, hexToRgb(tk.fgNeutral));
		t.near(`${l} 금액 오른쪽 끝`, amount.r, b.r, 0.5);
		t.near(
			`${l} 금액 세로 가운데(행 위 + 14 + 22)`,
			amount.y + amount.h / 2,
			r.rect.y + 36,
			1.5,
		);
		t.ok(`${l} 금액이 한 줄`, amount.h <= 20, amount.h, "≤ 20");
		t.ok(
			`${l} 금액 폭이 행 폭의 55% 이하`,
			amount.w <= (b.r - b.l) * 0.55 + 0.5,
			amount.w,
			`≤ ${(b.r - b.l) * 0.55}`,
		);
	});
	const firstRow = m.lis[0];
	if (firstRow) {
		t.near(
			`${label} 첫 행이 건수 줄(조건 확장 안내가 있으면 그 안내) 바로 아래 16`,
			firstRow.rect.y,
			(c12Notices(m)[0]?.b ?? m.summary?.rect.b ?? Number.NaN) + 16,
			0.5,
		);
	}
}
