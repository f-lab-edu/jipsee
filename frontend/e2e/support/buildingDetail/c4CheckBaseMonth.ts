import { BASE_MONTH_TEXT } from "./c4Info";
import type { T } from "./makeT";
import type { InfoMeasure } from "./measureInfo";

export function c4CheckBaseMonth(
	t: T,
	m: InfoMeasure,
	id: number,
	g: { cardX: number; cardW: number },
) {
	t.eq(`id ${id} 기준 월 문구`, m.base?.text, BASE_MONTH_TEXT);
	t.eq(
		`id ${id} 기준 월 글자 12/16`,
		[m.base?.fs, m.base?.lh],
		["12px", "16px"],
	);
	t.eq(`id ${id} 기준 월 오른쪽 정렬`, m.base?.ta, "right");
	t.near(
		`id ${id} 기준 월 글자 오른쪽 끝`,
		m.base?.textRight,
		g.cardX + g.cardW,
	);
	t.near(`id ${id} 기준 월 x`, m.base?.rect.x, g.cardX);
	t.near(`id ${id} 기준 월 w`, m.base?.rect.w, g.cardW);
}
