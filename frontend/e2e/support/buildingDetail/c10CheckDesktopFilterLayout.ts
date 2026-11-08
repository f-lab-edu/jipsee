import { C6_TOKENS } from "./c6Tokens";
import type { C10Measure } from "./c10MeasureNearby";
import { hexToRgb } from "./hexToRgb";
import type { T } from "./makeT";

export function c10CheckDesktopFilterLayout(
	t: T,
	m: C10Measure,
	hasArea: boolean,
	label: string,
) {
	const tk = C6_TOKENS[t.theme];
	const g = m.groups ?? [];
	const g0 = g[0];
	t.color(
		`${label} 필터 상자 배경 bg.layerBasement`,
		m.box?.bg,
		hexToRgb(tk.layerBasement),
	);
	t.eq(`${label} 필터 상자 padding 16/20`, m.box?.pad, "16px 20px 16px 20px");
	t.eq(`${label} 필터 상자 둥글기 14`, m.box?.radius, "14px");
	t.eq(
		`${label} 필터 상자 줄바꿈 간격 12(행) 28(열)`,
		[m.box?.rowGap, m.box?.colGap],
		["12px", "28px"],
	);
	t.eq(`${label} 필터 상자 wrap`, m.box?.wrap, "wrap");
	t.eq(`${label} 필터 상자 가로 배치`, m.box?.dir, "row");
	t.near(
		`${label} 필터 상자 x(카드 안쪽 시작)`,
		m.box?.rect.x,
		144 + 1 + 32,
		1,
	);
	t.near(
		`${label} 필터 상자 w(748 - border 2 - padding 64)`,
		m.box?.rect.w,
		748 - 2 - 64,
		1,
	);
	t.near(
		`${label} 필터 상자가 제목 아래 20`,
		(m.box?.rect.y ?? Number.NaN) - (m.title?.rect.b ?? Number.NaN),
		20,
		1,
	);
	t.near(
		`${label} 첫 그룹 x(상자 x + padding 20)`,
		g0?.rect.x,
		(m.box?.rect.x ?? Number.NaN) + 20,
		1,
	);
	t.near(
		`${label} 첫 그룹 y(상자 y + padding 16)`,
		g0?.rect.y,
		(m.box?.rect.y ?? Number.NaN) + 16,
		1,
	);
	g.forEach((gr, i) => {
		t.near(
			`${label} ${gr.labelText} 그룹이 첫 그룹과 같은 줄`,
			gr.rect.y,
			g0?.rect.y,
			0.5,
		);
		const before = g[i - 1];
		if (before) {
			t.near(
				`${label} ${gr.labelText} 그룹과 앞 그룹 가로 간격 28`,
				gr.rect.x - before.rect.r,
				28,
				1,
			);
		}
		t.near(
			`${label} ${gr.labelText} 라벨 x가 그룹 x와 같음(라벨 폭 지정 없음)`,
			gr.label?.rect.x,
			gr.rect.x,
			0.5,
		);
		t.ok(
			`${label} ${gr.labelText} 라벨 칸이 글자 폭 그대로(36 아님)`,
			Math.abs(
				(gr.label?.cellW ?? Number.NaN) - (gr.label?.rect.w ?? Number.NaN),
			) <= 1,
			gr.label?.cellW,
			`≈ ${gr.label?.rect.w}`,
		);
	});
	if (hasArea) {
		const boxH = 16 + 36 + 12 + 20 + 16;
		t.near(
			`${label} 필터 상자 높이(16 + 36 + 12 + 20 + 16)`,
			m.box?.rect.h,
			boxH,
			1,
		);
		t.near(
			`${label} 면적 줄이 첫 줄 아래 12(다음 줄로 줄바꿈)`,
			(m.area?.label?.rect.y ?? Number.NaN) - 2,
			(g0?.rect.y ?? Number.NaN) + 36 + 12,
			1.5,
		);
		t.near(
			`${label} 면적 라벨 x가 첫 그룹 x와 같음`,
			m.area?.label?.rect.x,
			g0?.rect.x,
			1,
		);
		t.ok(
			`${label} 면적 라벨 칸이 글자 폭 그대로(36 아님)`,
			Math.abs(
				(m.area?.label?.cellW ?? Number.NaN) -
					(m.area?.label?.rect.w ?? Number.NaN),
			) <= 1,
			m.area?.label?.cellW,
			`≈ ${m.area?.label?.rect.w}`,
		);
	} else {
		t.near(
			`${label} 필터 상자 높이(16 + 36 + 16)`,
			m.box?.rect.h,
			16 + 36 + 16,
			1,
		);
	}
}
