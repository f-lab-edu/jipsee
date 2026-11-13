import { LINK_BG } from "./c5Links";
import type { LinksMeasure } from "./c5MeasureLinks";
import type { T } from "./makeT";

export function c5CheckLinkTheme(t: T, m: LinksMeasure, label: string) {
	t.color(`${label} 토큰 bg.neutralWeak`, m.tokenBg, LINK_BG[t.theme]);
	for (const l of m.links) {
		t.color(
			`${label} ${l.text} 배경 = var(--seed-color-bg-neutral-weak)`,
			l.bg,
			m.tokenBg,
		);
		t.color(`${label} ${l.text} 배경 (캔버스 값)`, l.bg, LINK_BG[t.theme]);
		t.color(
			`${label} ${l.text} 글자 fg.neutral`,
			l.label?.color,
			t.tokens.fgNeutral,
		);
		t.color(
			`${label} ${l.text} 아이콘 색 fg.neutral`,
			l.svg?.color,
			t.tokens.fgNeutral,
		);
	}
}
