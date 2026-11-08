import { c4CardHeight } from "./c4CardHeight";
import { c4GridCells } from "./c4GridCells";
import { INFO, INFO_DONG_NAMES } from "./c4Info";
import type { T } from "./makeT";
import type { InfoMeasure } from "./measureInfo";

type CardGeometry = {
	cardX: number;
	cardW: number;
	firstCardY: number;
	gap: number;
	titleFs: string;
};

/** 모든 동 카드의 위치, 크기, 항목 위치를 검사함. g는 레이아웃별 기준값 */
export function c4CheckCards(
	t: T,
	m: InfoMeasure,
	id: number,
	g: CardGeometry,
) {
	const cards = m.cards ?? [];
	const expectedDongs = INFO[id];
	t.eq(`id ${id} 동 카드 개수`, cards.length, expectedDongs.length);
	let y = g.firstCardY;
	expectedDongs.forEach((rows, i) => {
		const c = cards[i];
		if (!c) return;
		const label = `id ${id} ${INFO_DONG_NAMES[id][i]}`;
		const h = c4CardHeight(rows, true);
		t.near(`${label} 카드 x`, c.rect.x, g.cardX);
		t.near(`${label} 카드 y`, c.rect.y, y);
		t.near(`${label} 카드 w`, c.rect.w, g.cardW);
		t.near(`${label} 카드 h`, c.rect.h, h);
		t.eq(`${label} 카드 border 두께`, c.bw, "1px");
		t.eq(`${label} 카드 둥글기 r3_5`, c.radius, "14px");
		t.eq(`${label} 카드 padding 16`, c.pad, "16px 16px 16px 16px");
		t.eq(`${label} 제목`, c.title?.text, INFO_DONG_NAMES[id][i]);
		t.near(`${label} 제목 x`, c.title?.rect.x, g.cardX + 17);
		t.near(`${label} 제목 y`, c.title?.rect.y, y + 17);
		t.near(`${label} 제목 h`, c.title?.rect.h, 22);
		t.eq(`${label} 제목 글자 크기`, c.title?.fs, g.titleFs);
		t.eq(`${label} 제목 줄 높이`, c.title?.lh, "22px");
		t.eq(`${label} 제목 굵기`, c.title?.fw, "700");
		t.eq(
			`${label} 항목 라벨 순서`,
			c.items.map((it) => it.dt?.text),
			rows.map(([itemLabel]) => itemLabel),
		);
		t.eq(
			`${label} 항목 값`,
			c.items.map((it) => it.dd?.text),
			rows.map(([, value]) => value),
		);
		t.eq(
			`${label} 항목 안 요소 순서`,
			[...new Set(c.items.map((it) => it.tags))],
			["dt,dd"],
		);
		const { cells } = c4GridCells(rows);
		const innerX = g.cardX + 17;
		const innerW = g.cardW - 34;
		const colW = (innerW - 16) / 2;
		const gridY = y + 17 + 34;
		c.items.forEach((it, k) => {
			const cell = cells[k];
			if (!cell) return;
			const name = `${label} ${it.dt?.text}`;
			const x = innerX + cell.col * (colW + 16);
			const itemY = gridY + cell.row * 50;
			t.near(`${name} x`, it.dt?.rect.x, x);
			t.near(`${name} 라벨 y`, it.dt?.rect.y, itemY);
			t.near(`${name} 라벨 h`, it.dt?.rect.h, 16);
			t.near(`${name} 값 y (라벨 아래 간격 2)`, it.dd?.rect.y, itemY + 18);
			t.near(`${name} 값 h`, it.dd?.rect.h, 20);
			t.near(`${name} 칸 폭`, it.dt?.rect.w, cell.wide ? innerW : colW);
			t.eq(
				`${name} 라벨 글자 12/16 굵기 400`,
				[it.dt?.fs, it.dt?.lh, it.dt?.fw],
				["12px", "16px", "400"],
			);
			t.eq(
				`${name} 값 글자 14/20 굵기 500`,
				[it.dd?.fs, it.dd?.lh, it.dd?.fw],
				["14px", "20px", "500"],
			);
			t.ok(
				`${name} 값이 카드 안에 들어옴`,
				(it.dd?.textRight ?? Number.POSITIVE_INFINITY) <= c.rect.r - 16,
				it.dd?.textRight,
				`≤ ${c.rect.r - 16}`,
			);
		});
		y += h + g.gap;
	});
	const lastBottom = y - g.gap;
	t.near(
		`id ${id} 기준 월 y (마지막 카드 아래 간격 ${g.gap})`,
		m.base?.rect.y,
		lastBottom + g.gap,
	);
	return y;
}
