import { MOBILE_CARD } from "../viewports";
import type { C10Measure } from "./c10MeasureNearby";
import type { T } from "./makeT";

export function c10CheckMobileFilterLayout(
	t: T,
	m: C10Measure,
	hasArea: boolean,
	label: string,
) {
	const g = m.groups ?? [];
	const x0 = MOBILE_CARD.x + 16;
	t.eq(`${label} 필터 묶음 세로 쌓기`, m.box?.dir, "column");
	t.eq(`${label} 필터 묶음 배경 없음`, m.box?.bg, "rgba(0, 0, 0, 0)");
	t.eq(`${label} 필터 묶음 간격 10`, m.box?.rowGap, "10px");
	t.near(`${label} 필터 묶음 x`, m.box?.rect.x, x0, 0.5);
	t.near(
		`${label} 필터 묶음 w`,
		m.box?.rect.w,
		m.vw - 2 * MOBILE_CARD.x - 32,
		0.5,
	);
	t.near(
		`${label} 첫 그룹이 제목 아래 16`,
		(g[0]?.rect.y ?? Number.NaN) - (m.title?.rect.b ?? Number.NaN),
		16,
		1,
	);
	g.forEach((gr, i) => {
		t.near(`${label} ${gr.labelText} 그룹 x`, gr.rect.x, x0, 0.5);
		t.near(`${label} ${gr.labelText} 라벨 칸 폭 36`, gr.label?.cellW, 36, 0.5);
		t.near(
			`${label} ${gr.labelText} 첫 칩 x(카드 안쪽 16 + 36 + 8)`,
			gr.chips[0]?.rect.x,
			x0 + 36 + 8,
			1,
		);
		const before = g[i - 1];
		if (before) {
			t.near(
				`${label} ${gr.labelText} 그룹이 앞 그룹 아래 10`,
				gr.rect.y - before.rect.b,
				10,
				1,
			);
		}
	});
	if (hasArea) {
		t.near(
			`${label} 면적 줄이 유형 그룹 아래 10`,
			(m.area?.label?.rect.y ?? Number.NaN) - 2 - (g[2]?.rect.b ?? Number.NaN),
			10,
			1.5,
		);
		t.near(`${label} 면적 라벨 칸 폭 36`, m.area?.label?.cellW, 36, 0.5);
		t.near(`${label} 면적 라벨 x`, m.area?.label?.rect.x, x0, 0.5);
		t.near(
			`${label} 잠금 아이콘 x(카드 안쪽 16 + 36 + 8)`,
			m.area?.svg?.rect.x,
			x0 + 36 + 8,
			1,
		);
		t.near(
			`${label} 필터 묶음 높이(3그룹 36 + 면적 20 + 간격 10 x 3)`,
			m.box?.rect.h,
			36 * 3 + 20 + 30,
			1,
		);
	} else {
		t.near(
			`${label} 필터 묶음 높이(3그룹 36 + 간격 10 x 2)`,
			m.box?.rect.h,
			36 * 3 + 20,
			1,
		);
	}
}
