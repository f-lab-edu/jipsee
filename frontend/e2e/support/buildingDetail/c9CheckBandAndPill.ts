import { C9_BAND_FILL, C9_BAND_PCT, C9_LAYOUT } from "./c9Constants";
import type { T } from "./makeT";
import type { ChartMeasure } from "./measureChart";
import { type Theme, TOKENS } from "./tokens";

/** 이전 건물 영역과 알약: id 3(이전 건물 2012.03 하나, 현재 건물 거래 없음)에만 있음 */
export function c9CheckBandAndPill(
	t: T,
	m: Required<ChartMeasure>,
	layout: "mobile" | "desktop",
	theme: Theme,
) {
	const L = C9_LAYOUT[layout];
	const b = m.band;
	const p = m.pill;
	t.ok("이전 건물 영역이 있음", !!b, b, "있음");
	if (b) {
		t.near("영역 왼쪽", b.x, 0, 1);
		t.near("영역 위쪽", b.y, 0, 1);
		t.near("영역 높이가 그래프 높이와 같음", b.h, L.boxH, 1);
		// 캔버스는 폭 13.12%에 content-box 1px 점선 border가 붙어 바깥이 1px 넓고, 앱은 영역 폭이 13.12%이고 점선이 오른쪽 가장자리에 걸침
		t.near("영역 폭 13.12%", (b.w / m.box.w) * 100, C9_BAND_PCT, 0.1);
		t.near(
			"영역 오른쪽 점선의 가로 위치(캔버스 border 중심 = 13.12% + 0.5px)",
			b.edgeX,
			(C9_BAND_PCT / 100) * m.box.w + 0.5,
			1,
		);
		t.color("영역 채움 bg.neutralWeak", b.fill, C9_BAND_FILL[theme]);
		t.color(
			"영역 점선 색 stroke.neutralWeak",
			b.edgeStroke,
			TOKENS[theme].strokeWeak,
		);
		t.eq("영역 점선 굵기", b.edgeSw, "1px");
		t.ok(
			"영역 오른쪽 가장자리는 점선",
			b.edgeDash !== "none",
			b.edgeDash,
			"dasharray 있음",
		);
		t.eq("영역 글자", b.label.text, "이전 건물");
		t.near("영역 글자 왼쪽", b.label.x, 6, 1);
		t.near("영역 글자 위쪽", b.label.y, 6, 1);
		t.eq(
			"영역 글자 크기, 줄 높이, 굵기",
			[b.label.fs, b.label.lh, b.label.fw],
			["11px", "14px", "400"],
		);
		t.color(
			"영역 글자 색 fg.neutralMuted",
			b.label.color,
			TOKENS[theme].fgMuted,
		);
	}
	t.ok("알약이 있음", !!p, p, "있음");
	if (p) {
		t.eq("알약 문구", p.text, "현재 건물 거래가 없어요");
		// 바깥 크기: 캔버스 안쪽 157.41 x 36에 box-shadow 고리 1px가 바깥에 붙어 159.41 x 38. 앱은 border 1px라 border-box가 같음
		t.near("알약 폭(고리 포함)", p.w, L.pillTextW + 28 + 2, 1);
		t.near("알약 높이(고리 포함)", p.h, 38, 0.6);
		t.near("알약 가운데 x가 그래프 가운데", p.cx, m.box.w / 2, 1);
		t.near("알약 가운데 y가 그래프 가운데", p.cy, m.box.h / 2, 1);
		t.color("알약 배경 bg.layerDefault", p.bg, TOKENS[theme].layerDefault);
		t.eq(
			"알약 고리 1px stroke.neutralWeak",
			`${p.border.split(" ")[0]} ${p.border.split(" ")[1]}`,
			"1px solid",
		);
		t.color(
			"알약 고리 색",
			p.border.slice(p.border.indexOf("rgb")),
			TOKENS[theme].strokeWeak,
		);
		t.ok(
			"알약 모서리가 완전히 둥긂",
			Number.parseFloat(p.radius) >= 19,
			p.radius,
			"높이의 절반 이상",
		);
		t.eq("알약 안쪽 여백 위아래 8, 좌우 14", p.pad, "8px 14px");
		t.eq(
			"알약 글자 크기, 줄 높이, 굵기",
			[p.fs, p.lh, p.fw],
			["14px", "20px", "700"],
		);
		t.color("알약 글자 색 fg.neutral", p.color, TOKENS[theme].fgNeutral);
		t.near("알약 글자 왼쪽(고리 안쪽 14 + 고리 1)", p.textX, 15, 1);
		t.near("알약 글자 위쪽(고리 안쪽 9 + 고리 1)", p.textY, 10, 1);
	}
}
