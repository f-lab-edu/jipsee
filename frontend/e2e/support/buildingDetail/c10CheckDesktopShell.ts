import { C6_TOKENS } from "./c6Tokens";
import type { C10Measure } from "./c10MeasureNearby";
import { hexToRgb } from "./hexToRgb";
import type { T } from "./makeT";

export function c10CheckDesktopShell(t: T, m: C10Measure, label: string) {
	const tk = C6_TOKENS[t.theme];
	t.eq(
		`${label} 보이는 제목 id 접미사`,
		m.title?.id,
		"nearby-deals-title-desktop",
	);
	t.eq(
		`${label} 섹션 aria-labelledby`,
		m.section?.labelledBy,
		"nearby-deals-title-desktop",
	);
	t.near(`${label} 카드 x`, m.section?.rect.x, 144, 1);
	t.near(`${label} 카드 w`, m.section?.rect.w, 748, 1);
	t.eq(
		`${label} 카드 padding 위28 좌우32 아래28`,
		m.section?.pad,
		"28px 32px 28px 32px",
	);
	t.eq(`${label} 카드 둥글기 20`, m.section?.radius, "20px");
	t.eq(`${label} 카드 border 1px`, m.section?.bw, "1px");
	t.color(
		`${label} 카드 border stroke.neutralMuted`,
		m.section?.bc,
		t.tokens.strokeMuted,
	);
	t.color(
		`${label} 카드 배경 bg.layerDefault`,
		m.section?.bg,
		hexToRgb(tk.layerDefault),
	);
	t.eq(`${label} 카드 내부 간격 20`, m.section?.gap, "20px");
	t.eq(
		`${label} 제목 글자 20/27 bold`,
		[m.title?.fs, m.title?.lh, m.title?.fw],
		["20px", "27px", "700"],
	);
	t.color(
		`${label} 제목 색 fg.neutral`,
		m.title?.color,
		hexToRgb(tk.fgNeutral),
	);
	t.near(
		`${label} 제목 x(카드 x + border 1 + padding 32)`,
		m.title?.rect.x,
		144 + 1 + 32,
		1,
	);
	t.near(
		`${label} 제목 y(카드 y + border 1 + padding 28)`,
		m.title?.rect.y,
		(m.section?.rect.y ?? Number.NaN) + 1 + 28,
		1,
	);
	t.near(`${label} 제목 h`, m.title?.rect.h, 27, 0.5);
	t.near(
		`${label} 거래 이력 카드와 간격 24`,
		(m.section?.rect.y ?? Number.NaN) - (m.dealBottom ?? Number.NaN),
		24,
		1,
	);
	t.eq(
		`${label} 데스크톱에는 8px 띠가 없음`,
		m.prev?.h === "8px" &&
			Math.round(m.prev.rect.w) === Math.round(m.section?.rect.w ?? 0),
		false,
	);
}
