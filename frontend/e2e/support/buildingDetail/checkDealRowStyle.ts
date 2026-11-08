import type { C6Tokens } from "./c6Tokens";
import { dealBadgeColors } from "./dealBadgeColors";
import type { DealExpectation } from "./dealExpectation";
import { hexToRgb } from "./hexToRgb";
import type { T } from "./makeT";
import type { DealRow } from "./measureDeals";
import { ringOf } from "./ringOf";

/** 거래 행 하나의 글자, 배지, 금액 스타일 (모바일과 데스크톱 공통) */
export function checkDealRowStyle(
	t: T,
	row: DealRow,
	exp: DealExpectation,
	tk: C6Tokens,
	label: string,
	amountFs: string,
	amountLh: string,
	metaFs: string,
	metaLh: string,
) {
	const expLabels = [
		exp.type,
		...(exp.cancelled ? ["해제"] : []),
		...(exp.similar ? ["유사 건물"] : []),
	];
	t.eq(
		`${label} 배지 문구와 순서`,
		row.badges.map((b) => b.text),
		expLabels,
	);
	const bc = dealBadgeColors(exp.kind, tk);
	const tb = row.badges[0];
	if (tb) {
		t.color(`${label} 구분 배지 배경`, tb.bg, bc.bg);
		t.color(`${label} 구분 배지 글자 색`, tb.color, bc.fg);
		t.eq(
			`${label} 구분 배지 글자 12/16 medium`,
			[tb.fs, tb.lh, tb.fw],
			["12px", "16px", "500"],
		);
	}
	for (const b of row.badges) {
		t.near(`${label} ${b.text} 배지 높이`, b.box.h, 24, 0.5);
		t.eq(`${label} ${b.text} 배지 padding 4/8`, b.pad, "4px 8px");
		t.eq(`${label} ${b.text} 배지 둥글기 6`, b.radius, "6px");
		t.near(`${label} ${b.text} 배지 글자 세로 가운데`, b.t.cy, b.box.y + 12, 1);
	}
	row.badges.forEach((b, i) => {
		if (i > 0) {
			t.near(
				`${label} 배지 ${i - 1}와 ${i} 간격`,
				b.box.x - row.badges[i - 1].box.r,
				4,
				0.5,
			);
		}
	});
	if (exp.cancelled) {
		const b = row.badges[1];
		if (b) {
			t.color(
				`${label} 해제 배지 글자 palette.red800`,
				b.color,
				hexToRgb(tk.red800),
			);
			t.eq(
				`${label} 해제 배지 글자 12/16 bold`,
				[b.fs, b.lh, b.fw],
				["12px", "16px", "700"],
			);
			t.eq(`${label} 해제 배지 배경 없음`, b.bg, "rgba(0, 0, 0, 0)");
			const ring = ringOf(b.shadow);
			t.ok(
				`${label} 해제 배지 고리 1px inset`,
				!!ring,
				b.shadow,
				"색 0 0 0 1px inset",
			);
			if (ring) {
				t.color(
					`${label} 해제 배지 고리 stroke.criticalWeak`,
					ring,
					hexToRgb(tk.criticalWeak),
				);
			}
		}
	}
	if (exp.similar) {
		const b = row.badges[exp.cancelled ? 2 : 1];
		if (b) {
			t.color(
				`${label} 유사 건물 배지 글자 fg.neutralMuted`,
				b.color,
				hexToRgb(tk.fgMuted),
			);
			t.eq(
				`${label} 유사 건물 배지 글자 12/16 bold`,
				[b.fs, b.lh, b.fw],
				["12px", "16px", "700"],
			);
			t.eq(`${label} 유사 건물 배지 배경 없음`, b.bg, "rgba(0, 0, 0, 0)");
			const ring = ringOf(b.shadow);
			t.ok(
				`${label} 유사 건물 배지 고리 1px inset`,
				!!ring,
				b.shadow,
				"색 0 0 0 1px inset",
			);
			if (ring) {
				t.color(
					`${label} 유사 건물 배지 고리 stroke.neutralWeak`,
					ring,
					hexToRgb(tk.strokeWeak),
				);
			}
		}
	}
	t.eq(`${label} 날짜 문구`, row.date.text, exp.date);
	t.eq(`${label} 면적 문구`, row.area.text, exp.area);
	t.eq(`${label} 금액 문구`, row.amount.text, exp.amount);
	t.eq(
		`${label} 날짜 글자 크기, 줄 높이, 굵기`,
		[row.date.fs, row.date.lh, row.date.fw],
		[metaFs, metaLh, "400"],
	);
	t.eq(
		`${label} 면적 글자 크기, 줄 높이, 굵기`,
		[row.area.fs, row.area.lh, row.area.fw],
		[metaFs, metaLh, "400"],
	);
	t.eq(
		`${label} 금액 글자 크기, 줄 높이, 굵기`,
		[row.amount.fs, row.amount.lh, row.amount.fw],
		[amountFs, amountLh, "700"],
	);
	t.color(
		`${label} 면적 색 fg.neutralMuted`,
		row.area.color,
		hexToRgb(tk.fgMuted),
	);
	t.color(
		`${label} 금액 색 ${exp.cancelled ? "fg.neutralSubtle" : "fg.neutral"}`,
		row.amount.color,
		hexToRgb(exp.cancelled ? tk.fgSubtle : tk.fgNeutral),
	);
	t.eq(
		`${label} 금액 취소선`,
		row.amount.td,
		exp.cancelled ? "line-through" : "none",
	);
	t.eq(`${label} 날짜 취소선 없음`, row.date.td, "none");
}
