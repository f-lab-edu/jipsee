import type { C6Tokens } from "./c6Tokens";
import { hexToRgb } from "./hexToRgb";
import type { T } from "./makeT";
import type { DealsMeasure } from "./measureDeals";

/** 모바일 섹션 껍데기: 설계 2절 본문 바깥(padding 위 20 좌우 16 아래 24, 사이 띠 8), 글자 18/24 bold */
export function c6CheckMobileSection(
	t: T,
	m: DealsMeasure,
	tk: C6Tokens,
	secX: number,
	secW: number,
) {
	t.eq("보이는 거래 이력 섹션 개수", m.visibleSections, 1);
	t.near("섹션 x", m.section?.rect.x, secX, 1);
	t.near("섹션 w", m.section?.rect.w, secW, 1);
	t.eq(
		"섹션 padding 위20 좌우16 아래24",
		m.section?.pad,
		"20px 16px 24px 16px",
	);
	t.eq("섹션 border 없음", m.section?.bw, "0px");
	t.color(
		"섹션 배경 bg.layerDefault",
		m.section?.bg,
		hexToRgb(tk.layerDefault),
	);
	t.eq("제목 문구", m.title?.text, "거래 이력");
	t.near("제목 x", m.title?.rect.x, secX + 16, 1);
	t.near("제목 y", m.title?.rect.y, (m.section?.rect.y ?? Number.NaN) + 20, 1);
	t.near("제목 h", m.title?.rect.h, 24, 0.5);
	t.eq(
		"제목 글자 18/24 bold",
		[m.title?.fs, m.title?.lh, m.title?.fw],
		["18px", "24px", "700"],
	);
	t.color("제목 색 fg.neutral", m.title?.color, hexToRgb(tk.fgNeutral));
	t.eq(
		"섹션 aria-labelledby가 제목 id를 가리키고 접미사가 -mobile임",
		[m.section?.labelledBy, m.title?.id],
		["deal-history-title-mobile", "deal-history-title-mobile"],
	);
	t.near("앞 띠 높이 8", m.prev?.rect.h, 8, 0.5);
	t.eq("앞 띠 height 8px", m.prev?.h, "8px");
	t.color(
		"앞 띠 배경 bg.layerBasement",
		m.prev?.bg,
		hexToRgb(tk.layerBasement),
	);
	t.near("앞 띠 x", m.prev?.rect.x, secX, 1);
	t.near("앞 띠 w", m.prev?.rect.w, secW, 1);
	t.near("앞 띠가 섹션 바로 위", m.prev?.rect.b, m.section?.rect.y, 0.5);
	t.near(
		"앞 띠가 건물 정보 섹션 바로 아래",
		m.prev?.rect.y,
		m.prev?.prevBottom ?? undefined,
		0.5,
	);
}
