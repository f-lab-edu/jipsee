import type { C6Tokens } from "./c6Tokens";
import { hexToRgb } from "./hexToRgb";
import type { T } from "./makeT";
import type { DealsMeasure } from "./measureDeals";

/** 데스크톱 섹션 껍데기: 카드 padding 28/32, 둥글기 20, 1px stroke.neutralMuted border(캔버스에는 없고 사용자가 정한 것 1), 제목 20/27 bold */
export function c6CheckDesktopSection(t: T, m: DealsMeasure, tk: C6Tokens) {
	t.eq("보이는 거래 이력 섹션 개수", m.visibleSections, 1);
	t.near("카드 x", m.section?.rect.x, 144, 1);
	t.near("카드 w", m.section?.rect.w, 748, 1);
	t.eq(
		"카드 padding 위28 좌우32 아래28",
		m.section?.pad,
		"28px 32px 28px 32px",
	);
	t.eq("카드 둥글기 20", m.section?.radius, "20px");
	t.eq("카드 border 1px", m.section?.bw, "1px");
	t.color(
		"카드 border stroke.neutralMuted",
		m.section?.bc,
		t.tokens.strokeMuted,
	);
	t.color(
		"카드 배경 bg.layerDefault",
		m.section?.bg,
		hexToRgb(tk.layerDefault),
	);
	t.eq("제목 문구", m.title?.text, "거래 이력");
	t.near(
		"제목 x (카드 x + border 1 + padding 32)",
		m.title?.rect.x,
		144 + 1 + 32,
		1,
	);
	t.near(
		"제목 y (카드 y + border 1 + padding 28)",
		m.title?.rect.y,
		(m.section?.rect.y ?? Number.NaN) + 1 + 28,
		1,
	);
	t.near("제목 h", m.title?.rect.h, 27, 0.5);
	t.eq(
		"제목 글자 20/27 bold",
		[m.title?.fs, m.title?.lh, m.title?.fw],
		["20px", "27px", "700"],
	);
	t.color("제목 색 fg.neutral", m.title?.color, hexToRgb(tk.fgNeutral));
	t.eq(
		"섹션 aria-labelledby가 제목 id를 가리키고 접미사가 -desktop임",
		[m.section?.labelledBy, m.title?.id],
		["deal-history-title-desktop", "deal-history-title-desktop"],
	);
	t.eq(
		"데스크톱에는 영역 구분 띠가 없음(앞 형제가 8px 띠가 아님)",
		m.prev?.h === "8px" && m.prev?.rect.w === m.section?.rect.w,
		false,
	);
}
