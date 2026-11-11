import type { C6Tokens } from "./c6Tokens";
import { checkDealRowStyle } from "./checkDealRowStyle";
import type { DealExpectation } from "./dealExpectation";
import type { T } from "./makeT";
import type { DealsMeasure } from "./measureDeals";

/** 모바일 목록 항목 (설계 2절 거래 목록 모바일, 캔버스 li: padding 14, 아래 1px stroke.neutralMuted, 배지 24, 배지 줄과 날짜 줄 간격 6) */
export function checkMobileDeals(
	t: T,
	m: DealsMeasure,
	exp: DealExpectation[],
	tk: C6Tokens,
	secX: number,
	secW: number,
) {
	t.ok("거래 이력 섹션이 보임", m.found, m.found, "있음");
	t.eq("모바일에서 table이 없음", m.table, null);
	t.eq("모바일 목록 항목 수", m.rows.length, exp.length);
	const rowW = secW - 32;
	m.rows.forEach((row, i) => {
		const e = exp[i];
		if (!e) return;
		const label = `행 ${i} ${e.date} ${e.type}`;
		t.near(`${label} x`, row.rect.x, secX + 16, 1);
		t.near(`${label} w`, row.rect.w, rowW, 1);
		t.near(
			`${label} h (padding 14 + 배지 24 + 간격 6 + 날짜 18 + padding 14 + border 1)`,
			row.rect.h,
			77,
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
		if (row.badges[0]) {
			t.near(`${label} 첫 배지 x`, row.badges[0].box.x, 0, 0.5);
			t.near(`${label} 첫 배지 y`, row.badges[0].box.y, 14, 0.5);
		}
		t.near(`${label} 날짜 x`, row.date.t.x, 0, 0.5);
		t.near(`${label} 날짜 세로 가운데 (14 + 24 + 6 + 9)`, row.date.t.cy, 53, 1);
		t.near(
			`${label} 면적 x (날짜 오른쪽 + 8)`,
			row.area.t.x,
			row.date.t.r + 8,
			1,
		);
		t.near(`${label} 면적 세로 가운데`, row.area.t.cy, 53, 1);
		t.near(`${label} 금액 오른쪽 끝이 행 오른쪽 끝`, row.amount.t.r, rowW, 1);
		t.near(
			`${label} 금액 세로 가운데 (왼쪽 묶음 가운데 14 + 24)`,
			row.amount.t.cy,
			38,
			1,
		);
		t.eq(
			`${label} 금액 칸 flexShrink 0, maxWidth 55%`,
			[row.amountBox?.shrink, row.amountBox?.maxW],
			["0", "55%"],
		);
		t.ok(
			`${label} 금액 칸 폭이 행 폭의 55% 이하`,
			(row.amountBox?.w ?? 1e9) <= rowW * 0.55 + 0.5,
			row.amountBox?.w,
			`≤ ${(rowW * 0.55).toFixed(1)}`,
		);
		const leftRight = Math.max(row.area.t.r, ...row.badges.map((b) => b.box.r));
		t.ok(
			`${label} 왼쪽 묶음과 금액 칸 간격 12 이상`,
			(row.amountBox?.x ?? -1e9) - leftRight >= 11.5,
			(row.amountBox?.x ?? Number.NaN) - leftRight,
			"≥ 12",
		);
		checkDealRowStyle(t, row, e, tk, label, "16px", "22px", "13px", "18px");
	});
}
