import type { C10Measure } from "./c10MeasureNearby";
import type { T } from "./makeT";

/** 칩 배치: 칩 간격 6, 라벨과 첫 칩 간격 8, 칩 세로 가운데 */
export function c10CheckChipLayout(t: T, m: C10Measure, label: string) {
	(m.groups ?? []).forEach((g) => {
		g.chips.forEach((c, ci) => {
			const before = g.chips[ci - 1];
			if (before) {
				t.near(
					`${label} ${g.labelText} ${c.text}와 앞 칩 간격 6`,
					c.rect.x - before.rect.r,
					6,
					0.5,
				);
			}
			t.near(
				`${label} ${g.labelText} ${c.text} 위 끝이 그룹 위 끝과 같음`,
				c.rect.y,
				g.rect.y,
				0.5,
			);
		});
		const first = g.chips[0];
		t.near(
			`${label} ${g.labelText} 라벨 오른쪽(칸 끝)과 첫 칩 간격 8`,
			(first?.rect.x ?? Number.NaN) -
				((g.label?.rect.x ?? Number.NaN) + (g.label?.cellW ?? Number.NaN)),
			8,
			1,
		);
		t.near(
			`${label} ${g.labelText} 라벨 글자 세로 가운데`,
			(g.label?.rect.y ?? Number.NaN) + (g.label?.rect.h ?? Number.NaN) / 2,
			g.rect.y + g.rect.h / 2,
			1.5,
		);
		t.eq(`${label} ${g.labelText} 그룹 높이 36`, Math.round(g.rect.h), 36);
	});
}
