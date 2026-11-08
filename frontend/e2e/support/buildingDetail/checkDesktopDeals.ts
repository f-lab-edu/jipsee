import type { C6Tokens } from "./c6Tokens";
import { checkDealRowStyle } from "./checkDealRowStyle";
import { DEAL_COLUMNS } from "./dealColumns";
import type { DealExpectation } from "./dealExpectation";
import { hexToRgb } from "./hexToRgb";
import type { T } from "./makeT";
import type { DealsMeasure } from "./measureDeals";

/** 데스크톱 표 (캔버스: 열 110 250 90 1fr, 열 간격 16, 머리 padding 위아래 10 아래 1px stroke.neutralWeak, 행 padding 위아래 14) */
export function checkDesktopDeals(
	t: T,
	m: DealsMeasure,
	exp: DealExpectation[],
	tk: C6Tokens,
	rowX: number,
	rowW: number,
	isPrev = false,
) {
	t.ok("거래 이력 섹션이 보임", m.found, m.found, "있음");
	if (isPrev) {
		t.eq(
			"이전 건물 table role, aria-label, 머리 없음",
			[
				m.table?.label,
				m.table?.rowRoles,
				m.table?.headerCount,
				m.table?.cellCount,
			],
			["이전 건물 거래", exp.length, 0, exp.length * 4],
		);
		t.eq("머리 행 없음", m.header ?? null, null);
	} else {
		t.eq(
			"table role과 aria-label",
			[
				m.table?.label,
				m.table?.rowRoles,
				m.table?.headerCount,
				m.table?.cellCount,
			],
			["현재 건물 거래", exp.length + 1, 4, exp.length * 4],
		);
		t.eq(
			"desktop 표 머리 문구와 순서",
			m.header?.cells.map((c) => c.text),
			DEAL_COLUMNS,
		);
	}
	t.eq("데스크톱 표 행 수", m.rows.length, exp.length);
	const h = m.header;
	if (h) {
		t.near("머리 x", h.rect.x, rowX, 1);
		t.near("머리 w", h.rect.w, rowW, 1);
		t.near(
			"머리 h (padding 10 + 줄 18 + padding 10 + border 1)",
			h.rect.h,
			39,
			0.5,
		);
		t.eq("머리 padding 위아래 10", h.pad, "10px 0px");
		t.eq("머리 아래 border 1px", h.bw, "1px");
		t.color(
			"머리 아래 border stroke.neutralWeak",
			h.bc,
			hexToRgb(tk.strokeWeak),
		);
		if (m.rows[0]) {
			t.near("첫 행이 머리 바로 아래", m.rows[0].rect.y, h.rect.b, 0.5);
		}
		const xs = [0, 126, 392];
		h.cells.forEach((c, i) => {
			t.eq(
				`머리 ${c.text} 글자 13/18 400`,
				[c.fs, c.lh, c.fw],
				["13px", "18px", "400"],
			);
			t.color(
				`머리 ${c.text} 색 fg.neutralMuted`,
				c.color,
				hexToRgb(tk.fgMuted),
			);
			t.near(`머리 ${c.text} 세로 가운데 (padding 10 + 9)`, c.t.cy, 19, 1);
			if (i < 3) t.near(`머리 ${c.text} x`, c.t.x, xs[i], 0.5);
			else {
				t.near(
					"머리 금액 오른쪽 끝이 표 오른쪽 끝(오른쪽 정렬)",
					c.t.r,
					rowW,
					1,
				);
			}
		});
	}
	m.rows.forEach((row, i) => {
		const e = exp[i];
		if (!e) return;
		const label = `행 ${i} ${e.date} ${e.type}`;
		t.near(`${label} x`, row.rect.x, rowX, 1);
		t.near(`${label} w`, row.rect.w, rowW, 1);
		t.near(
			`${label} h (padding 14 + 배지 24 + padding 14 + border 1)`,
			row.rect.h,
			53,
			0.5,
		);
		if (i > 0) {
			t.near(`${label} 위 행 바로 아래`, row.rect.y, m.rows[i - 1].rect.b, 0.5);
		}
		t.eq(
			`${label} 아래 border와 위아래 padding`,
			[row.border?.bw, row.border?.padY],
			["1px", "14px 14px"],
		);
		t.color(
			`${label} 아래 border stroke.neutralMuted`,
			row.border?.bc,
			t.tokens.strokeMuted,
		);
		const xs = [0, 126, 392, 498];
		const ws = [110, 250, 90, rowW - 498];
		(row.cells ?? []).forEach((c, k) => {
			t.near(`${label} 칸 ${k} x`, c.x, xs[k], 0.5);
			t.near(`${label} 칸 ${k} w`, c.w, ws[k], 1);
		});
		t.near(`${label} 날짜 x`, row.date.t.x, 0, 0.5);
		t.near(`${label} 날짜 세로 가운데`, row.date.t.cy, 26, 1);
		t.color(
			`${label} 날짜 색 fg.neutral`,
			row.date.color,
			hexToRgb(tk.fgNeutral),
		);
		if (row.badges[0]) {
			t.near(
				`${label} 첫 배지 x (구분 열 시작)`,
				row.badges[0].box.x,
				126,
				0.5,
			);
			t.near(`${label} 첫 배지 y`, row.badges[0].box.y, 14, 0.5);
		}
		t.near(`${label} 면적 x`, row.area.t.x, 392, 0.5);
		t.near(`${label} 면적 세로 가운데`, row.area.t.cy, 26, 1);
		t.near(`${label} 금액 오른쪽 끝이 행 오른쪽 끝`, row.amount.t.r, rowW, 1);
		t.near(`${label} 금액 세로 가운데`, row.amount.t.cy, 26, 1);
		checkDealRowStyle(t, row, e, tk, label, "15px", "22px", "15px", "22px");
	});
}
