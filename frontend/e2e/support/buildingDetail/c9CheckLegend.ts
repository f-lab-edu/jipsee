import { c9CheckMarkerShape } from "./c9CheckMarkerShape";
import { C9_LAYOUT, C9_LEGEND_ITEMS, C9_NOTE } from "./c9Constants";
import { c9ExpectColor } from "./c9ExpectColor";
import type { T } from "./makeT";
import type { ChartMeasure } from "./measureChart";
import { type Theme, TOKENS } from "./tokens";

/** 범례: 문구, 순서, 위치, 마커 크기와 모양, 색, 간격 */
export function c9CheckLegend(
	t: T,
	m: Required<ChartMeasure>,
	layout: "mobile" | "desktop",
	theme: Theme,
) {
	const L = C9_LAYOUT[layout];
	const lg = m.legend;
	t.eq(
		"범례 항목 글자(순서와 보조 문구)",
		lg.items.map((i) => i.text),
		[...C9_LEGEND_ITEMS.map((i) => i.text), C9_NOTE],
	);
	t.eq("범례 가로, 세로 간격", [lg.colGap, lg.rowGap], ["14px", "8px"]);
	t.eq("범례 줄바꿈", lg.wrap, "wrap");
	t.near("범례 높이", lg.h, L.legendH, 1);
	t.near(
		"범례 아래 끝과 그래프 격자 위 끝 간격",
		lg.bottomToGrid,
		L.gridGap,
		1,
	);
	C9_LEGEND_ITEMS.forEach((it, i) => {
		const a = lg.items[i];
		if (!a?.marker) {
			t.fail(`범례 "${it.text}" 항목 또는 마커 없음`);
			return;
		}
		t.near(`"${it.text}" 글자 왼쪽`, a.x, L.textX[i], 1);
		t.near(`"${it.text}" 글자 위쪽`, a.y, 1, 1);
		t.eq(
			`"${it.text}" 글자 크기, 줄 높이, 굵기`,
			[a.fs, a.lh, a.fw],
			["13px", "18px", "400"],
		);
		t.color(
			`"${it.text}" 글자 색 fg.neutralMuted`,
			a.color,
			TOKENS[theme].fgMuted,
		);
		t.near(`"${it.text}" 마커 폭`, a.marker.w, L.legendD, 0.5);
		t.near(`"${it.text}" 마커와 글자 간격`, a.marker.gapToText, 6, 1);
		t.near(
			`"${it.text}" 마커와 글자의 세로 중심 차이`,
			a.marker.cy - a.marker.textCy,
			0,
			1,
		);
		c9CheckMarkerShape(
			t,
			`범례 "${it.text}" 마커`,
			a.marker,
			it.kind,
			it.deal,
			L.legendD,
			c9ExpectColor(it.color, theme),
			theme,
		);
		const prev = lg.items[i - 1];
		if (i > 0 && prev) {
			t.near(
				`"${prev.text}" 글자 끝과 "${it.text}" 마커 사이 가로 간격(열 간격 14)`,
				a.marker.x - prev.r,
				14,
				1,
			);
		}
	});
	const note = lg.items[6];
	if (note) {
		t.near("보조 문구 왼쪽", note.x, L.noteX, 1);
		t.near("보조 문구 위쪽", note.y, L.noteY, 1);
		t.eq(
			"보조 문구 글자 크기, 줄 높이, 굵기",
			[note.fs, note.lh, note.fw],
			["12px", "18px", "400"],
		);
		t.color("보조 문구 색 fg.neutralMuted", note.color, TOKENS[theme].fgMuted);
		t.eq("보조 문구는 마커가 없음", note.marker, null);
		if (layout === "desktop") {
			t.near(
				"보조 문구는 같은 줄에서 이전 건물 글자 끝과 14 떨어짐",
				note.x - (lg.items[5]?.r ?? Number.NaN),
				14,
				1,
			);
		}
	}
}
