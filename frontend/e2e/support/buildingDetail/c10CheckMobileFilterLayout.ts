import { MOBILE_COLUMN } from "../viewports";
import type { C10Measure } from "./c10MeasureNearby";
import type { T } from "./makeT";

// 2026-11-09 피드백 9번: 그룹을 가로로 놓고 넘치면 줄바꿈함(행 간격 10, 열 간격 16)
export function c10CheckMobileFilterLayout(
	t: T,
	m: C10Measure,
	hasArea: boolean,
	label: string,
) {
	const g = m.groups ?? [];
	const x0 = MOBILE_COLUMN.x + 16;
	const lastGroupBottom = Math.max(...g.map((gr) => gr.rect.b));
	t.eq(`${label} 필터 묶음 가로 배치`, m.box?.dir, "row");
	t.eq(`${label} 필터 묶음 wrap`, m.box?.wrap, "wrap");
	t.eq(`${label} 필터 묶음 배경 없음`, m.box?.bg, "rgba(0, 0, 0, 0)");
	t.eq(
		`${label} 필터 묶음 간격 행 10, 열 16`,
		[m.box?.rowGap, m.box?.colGap],
		["10px", "16px"],
	);
	t.near(`${label} 필터 묶음 x`, m.box?.rect.x, x0, 0.5);
	t.near(
		`${label} 필터 묶음 w`,
		m.box?.rect.w,
		m.vw - 2 * MOBILE_COLUMN.x - 32,
		0.5,
	);
	t.near(
		`${label} 첫 그룹이 제목 아래 16`,
		(g[0]?.rect.y ?? Number.NaN) - (m.title?.rect.b ?? Number.NaN),
		16,
		1,
	);
	g.forEach((gr, i) => {
		t.near(
			`${label} ${gr.labelText} 라벨 칸 폭이 글자 폭 그대로(36 아님)`,
			gr.label?.cellW,
			gr.label?.rect.w,
			1,
		);
		t.ok(
			`${label} ${gr.labelText} 그룹이 필터 묶음 안`,
			gr.rect.x >= x0 - 0.5 && gr.rect.r <= x0 + (m.box?.rect.w ?? 0) + 0.5,
			gr.rect,
			"묶음 안",
		);
		const before = g[i - 1];
		if (before) {
			const sameRow = Math.abs(gr.rect.y - before.rect.y) <= 0.5;
			if (sameRow) {
				t.near(
					`${label} ${gr.labelText} 그룹과 앞 그룹 가로 간격 16`,
					gr.rect.x - before.rect.r,
					16,
					1,
				);
			} else {
				t.near(`${label} ${gr.labelText} 줄바꿈 그룹 x`, gr.rect.x, x0, 0.5);
				t.near(
					`${label} ${gr.labelText} 줄바꿈 그룹이 앞 그룹 아래 10`,
					gr.rect.y - before.rect.b,
					10,
					1,
				);
			}
		}
	});
	if (hasArea) {
		t.near(
			`${label} 면적 줄이 그룹 아래 10`,
			(m.area?.label?.rect.y ?? Number.NaN) - 2 - lastGroupBottom,
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
			`${label} 필터 묶음 아래 끝이 면적 줄 아래 끝(그룹 아래 + 10 + 20)`,
			m.box?.rect.b,
			lastGroupBottom + 10 + 20,
			1.5,
		);
	} else {
		t.near(
			`${label} 필터 묶음 아래 끝이 마지막 그룹 아래 끝`,
			m.box?.rect.b,
			lastGroupBottom,
			1,
		);
	}
}
