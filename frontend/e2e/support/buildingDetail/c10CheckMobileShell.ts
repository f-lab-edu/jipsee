import { C6_TOKENS } from "./c6Tokens";
import type { C10Measure } from "./c10MeasureNearby";
import { hexToRgb } from "./hexToRgb";
import type { T } from "./makeT";

export function c10CheckMobileShell(t: T, m: C10Measure, label: string) {
	const tk = C6_TOKENS[t.theme];
	t.eq(
		`${label} 보이는 제목 id 접미사`,
		m.title?.id,
		"nearby-deals-title-mobile",
	);
	t.eq(
		`${label} 섹션 aria-labelledby`,
		m.section?.labelledBy,
		"nearby-deals-title-mobile",
	);
	t.near(`${label} 섹션 x`, m.section?.rect.x, 0, 0.5);
	t.near(`${label} 섹션 w`, m.section?.rect.w, m.vw, 0.5);
	t.eq(
		`${label} 섹션 padding 위20 좌우16 아래24`,
		m.section?.pad,
		"20px 16px 24px 16px",
	);
	t.eq(`${label} 섹션 border 없음`, m.section?.bw, "0px");
	t.color(
		`${label} 섹션 배경 bg.layerDefault`,
		m.section?.bg,
		hexToRgb(tk.layerDefault),
	);
	t.eq(`${label} 섹션 간격 16`, m.section?.gap, "16px");
	t.eq(
		`${label} 제목 글자 18/24 bold`,
		[m.title?.fs, m.title?.lh, m.title?.fw],
		["18px", "24px", "700"],
	);
	t.color(
		`${label} 제목 색 fg.neutral`,
		m.title?.color,
		hexToRgb(tk.fgNeutral),
	);
	t.near(`${label} 제목 x`, m.title?.rect.x, 16, 0.5);
	t.near(
		`${label} 제목 y`,
		m.title?.rect.y,
		(m.section?.rect.y ?? Number.NaN) + 20,
		1,
	);
	t.near(`${label} 제목 h`, m.title?.rect.h, 24, 0.5);
	t.near(`${label} 앞 띠 높이 8`, m.prev?.rect.h, 8, 0.5);
	t.eq(`${label} 앞 띠 height 8px`, m.prev?.h, "8px");
	t.color(
		`${label} 앞 띠 배경 bg.layerBasement`,
		m.prev?.bg,
		hexToRgb(tk.layerBasement),
	);
	t.near(
		`${label} 앞 띠가 섹션 바로 위`,
		m.prev?.rect.b,
		m.section?.rect.y,
		0.5,
	);
	t.near(
		`${label} 앞 띠가 거래 이력 섹션 바로 아래`,
		m.prev?.rect.y,
		m.dealBottom ?? undefined,
		1,
	);
}
