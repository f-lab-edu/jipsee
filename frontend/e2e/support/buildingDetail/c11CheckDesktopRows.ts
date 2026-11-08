import { C6_TOKENS } from "./c6Tokens";
import { c11Bounds } from "./c11Bounds";
import { C11_HEADS, C11_TOKENS } from "./c11Fixtures";
import type { C11Measure } from "./c11Measure";
import { c12Notices } from "./c12Notices";
import { hexToRgb } from "./hexToRgb";
import type { T } from "./makeT";

/** 데스크톱 표: 머리 행, 열 위치, 행 높이와 padding, 칩, 날짜, 면적, 금액 */
export function c11CheckDesktopRows(t: T, m: C11Measure, label: string) {
	const tk = C6_TOKENS[t.theme];
	const k = C11_TOKENS[t.theme];
	const b = c11Bounds(m, "desktop");
	const h = m.header;
	t.ok(`${label} 머리 행이 있음`, !!h, h, "있음");
	const w = b.r - b.l;
	const first = w - 560 - 64; // 1fr 열 폭. 열 100 110 90 260, 간격 16 x 4
	const cx = [0, first + 16, first + 132, first + 258];
	if (h) {
		t.eq(
			`${label} 머리 문구와 순서`,
			h.texts.map((x) => x.t),
			C11_HEADS,
		);
		t.eq(`${label} 머리 columnheader 5개`, h.heads, 5);
		t.near(`${label} 머리 행 높이 39(10 + 18 + 10 + 1)`, h.rect.h, 39, 0.5);
		t.eq(`${label} 머리 위아래 padding 10`, h.pad, "10px 10px");
		t.eq(`${label} 머리 아래 1px solid`, [h.bbw, h.bbs], ["1px", "solid"]);
		t.color(
			`${label} 머리 아래 선 색 stroke.neutralWeak`,
			h.bbc,
			hexToRgb(tk.strokeWeak),
		);
		t.near(`${label} 머리 행 x`, h.rect.x, b.l, 0.5);
		t.near(`${label} 머리 행 w`, h.rect.w, w, 0.5);
		t.near(
			`${label} 머리 행이 건수 줄(조건 확장 안내가 있으면 그 안내) 바로 아래 20`,
			h.rect.y,
			(c12Notices(m)[0]?.b ?? m.summary?.rect.b ?? Number.NaN) + 20,
			0.5,
		);
		h.texts.forEach((x, i) => {
			t.eq(
				`${label} 머리 ${x.t} 글자 13/18 regular`,
				[x.fs, x.lh, x.fw],
				["13px", "18px", "400"],
			);
			t.color(
				`${label} 머리 ${x.t} 색 fg.neutralMuted`,
				x.color,
				hexToRgb(tk.fgMuted),
			);
			if (i < 4) {
				t.near(
					`${label} 머리 ${x.t} x`,
					x.x,
					h.rect.x + (cx[i] ?? Number.NaN),
					1,
				);
			} else {
				t.near(
					`${label} 머리 ${x.t} 오른쪽 정렬(오른쪽 끝이 행 오른쪽 끝)`,
					x.r,
					h.rect.r,
					1,
				);
			}
		});
		t.eq(
			`${label} 머리 열 정의`,
			h.cols.replace(/^[\d.]+px/, "N"),
			"N 100px 110px 90px 260px",
		);
		t.eq(`${label} 머리 열 간격 16`, h.cgap, "16px");
	}
	m.trs.forEach((r, i) => {
		const l = `${label} ${i + 1}행`;
		const [name, chipT, date, area, amount] = r.texts;
		if (!name || !chipT || !date || !area || !amount) {
			t.fail(`${l} 글자 칸이 다섯 개가 아님`);
			return;
		}
		t.eq(
			`${l} 열 정의(1fr 100 110 90 260)`,
			r.cols.replace(/^[\d.]+px/, "N"),
			"N 100px 110px 90px 260px",
		);
		t.eq(`${l} 열 간격 16`, r.cgap, "16px");
		t.eq(`${l} cell 5개`, r.cells, 5);
		t.eq(`${l} 위아래 padding 14`, r.pad, "14px 14px");
		t.eq(`${l} 구분선 아래쪽 1px solid`, [r.bbw, r.bbs], ["1px", "solid"]);
		t.color(`${l} 구분선 색 stroke.neutralMuted`, r.bbc, t.tokens.strokeMuted);
		t.ok(
			`${l} 높이 53(한 줄) 또는 73(건물명 두 줄)`,
			[53, 73].some((v) => Math.abs(r.rect.h - v) <= 0.5),
			r.rect.h,
			"53 또는 73",
		);
		t.near(`${l} x`, r.rect.x, b.l, 0.5);
		t.near(`${l} w`, r.rect.w, w, 0.5);
		const before = m.trs[i - 1];
		t.near(
			`${l} 앞 행 바로 아래`,
			r.rect.y,
			i === 0 ? (h?.rect.b ?? Number.NaN) : before?.rect.b,
			0.5,
		);
		const mid = r.rect.y + 14 + (r.rect.h - 29) / 2;
		t.eq(
			`${l} 건물명 글자 15/22 bold`,
			[name.fs, name.lh, name.fw],
			["15px", "22px", "700"],
		);
		t.color(`${l} 건물명 색 fg.neutral`, name.color, hexToRgb(tk.fgNeutral));
		t.near(`${l} 건물명 x`, name.x, r.rect.x, 0.5);
		t.near(`${l} 칩 상자 x`, r.chip?.x, r.rect.x + (cx[1] ?? Number.NaN), 1);
		t.near(`${l} 칩 상자 높이 24(padding 4 + 16 + 4)`, r.chip?.h, 24, 0.5);
		t.eq(
			`${l} 칩 padding 4/8, 둥글기 6`,
			[r.chip?.pad, r.chip?.radius],
			["4px 8px 4px 8px", "6px"],
		);
		t.color(`${l} 칩 배경 bg.neutralWeak`, r.chip?.bg, hexToRgb(k.neutralWeak));
		t.eq(
			`${l} 칩 글자 12/16 medium`,
			[chipT.fs, chipT.lh, chipT.fw],
			["12px", "16px", "500"],
		);
		t.color(
			`${l} 칩 글자색 fg.neutralMuted`,
			chipT.color,
			hexToRgb(tk.fgMuted),
		);
		t.near(
			`${l} 칩이 행 세로 가운데`,
			(r.chip?.y ?? Number.NaN) + (r.chip?.h ?? 0) / 2,
			mid,
			1.5,
		);
		t.near(`${l} 날짜 x`, date.x, r.rect.x + (cx[2] ?? Number.NaN), 1);
		t.eq(
			`${l} 날짜 글자 15/22 regular`,
			[date.fs, date.lh, date.fw],
			["15px", "22px", "400"],
		);
		t.color(`${l} 날짜 색 fg.neutral`, date.color, hexToRgb(tk.fgNeutral));
		t.near(`${l} 면적 x`, area.x, r.rect.x + (cx[3] ?? Number.NaN), 1);
		t.eq(
			`${l} 면적 글자 15/22 regular`,
			[area.fs, area.lh, area.fw],
			["15px", "22px", "400"],
		);
		t.color(`${l} 면적 색 fg.neutralMuted`, area.color, hexToRgb(tk.fgMuted));
		t.eq(
			`${l} 금액 글자 15/22 bold`,
			[amount.fs, amount.lh, amount.fw],
			["15px", "22px", "700"],
		);
		t.color(`${l} 금액 색 fg.neutral`, amount.color, hexToRgb(tk.fgNeutral));
		t.near(`${l} 금액 오른쪽 끝이 행 오른쪽 끝`, amount.r, r.rect.r, 1);
		t.ok(`${l} 금액이 한 줄`, amount.h <= 20, amount.h, "≤ 20");
		t.near(
			`${l} 날짜와 면적과 금액 같은 줄`,
			Math.max(date.y, area.y, amount.y) - Math.min(date.y, area.y, amount.y),
			0,
			0.5,
		);
		t.near(`${l} 날짜 세로 가운데`, date.y + date.h / 2, mid, 1.5);
	});
}
