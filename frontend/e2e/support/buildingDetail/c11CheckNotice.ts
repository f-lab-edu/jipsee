import { c11Confirmed } from "./c11Confirmed";
import { C11_NOTICE, C11_TOKENS } from "./c11Fixtures";
import type { C11Measure } from "./c11Measure";
import { hexToRgb } from "./hexToRgb";
import type { T } from "./makeT";

/** 확정일자 안내 상자 */
export function c11CheckNotice(
	t: T,
	m: C11Measure,
	layout: "mobile" | "desktop",
	label: string,
) {
	const k = C11_TOKENS[t.theme];
	const mob = layout === "mobile";
	const ns = c11Confirmed(m);
	t.eq(`${label} 확정일자 안내 개수`, ns.length, 1);
	const n = ns[0];
	if (!n) return;
	const text0 = n.texts[0];
	t.eq(`${label} 안내 role`, n.role, "note");
	t.eq(
		`${label} 안내 문구`,
		n.texts.map((x) => x.t),
		[C11_NOTICE],
	);
	t.eq(`${label} 안내 문구 요소 p`, text0?.tag, "P");
	t.eq(
		`${label} 안내 글자 14/20 regular`,
		[text0?.fs, text0?.lh, text0?.fw],
		["14px", "20px", "400"],
	);
	t.color(
		`${label} 안내 배경 bg.informativeWeak`,
		n.bg,
		hexToRgb(k.informativeWeak),
	);
	t.color(
		`${label} 안내 글자색 fg.informativeContrast`,
		text0?.color,
		hexToRgb(k.informativeContrast),
	);
	t.color(
		`${label} 안내 아이콘색 fg.informativeContrast`,
		n.svg?.color,
		hexToRgb(k.informativeContrast),
	);
	t.eq(`${label} 안내 둥글기 12, 간격 10`, [n.radius, n.gap], ["12px", "10px"]);
	t.ok(`${label} 안내 높이 50 이상`, n.h >= 49.5, n.h, "≥ 50");
	t.eq(`${label} 아이콘 aria-hidden`, n.svg?.ariaHidden, "true");
	if (mob) {
		t.eq(`${label} 안내 padding 14/16`, n.pad, "14px 16px 14px 16px");
		t.eq(`${label} 안내 위쪽 정렬`, n.align, "flex-start");
		t.near(`${label} 아이콘 크기 18`, n.svg?.w, 18, 0.5);
		t.near(`${label} 아이콘 y(상자 위 + 14 + 1)`, n.svg?.y, n.y + 15, 0.5);
		t.near(`${label} 아이콘 x(상자 x + 16)`, n.svg?.x, n.x + 16, 0.5);
		t.near(`${label} 문구 x(상자 x + 16 + 18 + 10)`, text0?.x, n.x + 44, 1);
		t.near(`${label} 상자 x`, n.x, m.section.x + 16, 0.5);
		t.near(`${label} 상자 w`, n.w, m.section.w - 32, 0.5);
		t.near(`${label} 섹션 아래 padding 24`, m.section.b - n.b, 24, 0.5);
	} else {
		t.eq(`${label} 안내 padding 14/18`, n.pad, "14px 18px 14px 18px");
		t.eq(`${label} 안내 세로 가운데 정렬`, n.align, "center");
		t.near(`${label} 아이콘 크기 20`, n.svg?.w, 20, 0.5);
		t.near(
			`${label} 아이콘 세로 가운데`,
			(n.svg?.y ?? Number.NaN) + 10,
			n.y + n.h / 2,
			1,
		);
		t.near(`${label} 아이콘 x(상자 x + 18)`, n.svg?.x, n.x + 18, 0.5);
		t.near(`${label} 문구 x(상자 x + 18 + 20 + 10)`, text0?.x, n.x + 48, 1);
		t.near(
			`${label} 문구 세로 가운데`,
			(text0?.y ?? Number.NaN) + (text0?.h ?? 0) / 2,
			n.y + n.h / 2,
			1.5,
		);
		t.near(`${label} 안내 높이 50(한 줄)`, n.h, 50, 0.5);
		t.near(
			`${label} 상자 x(카드 x + border 1 + padding 32)`,
			n.x,
			m.section.x + 33,
			0.5,
		);
		t.near(`${label} 상자 w`, n.w, m.section.w - 66, 0.5);
		t.near(
			`${label} 섹션 아래(padding 28 + border 1)`,
			m.section.b - n.b,
			29,
			0.5,
		);
	}
	t.near(
		`${label} 안내가 앞 요소 아래 ${mob ? 16 : 20}`,
		n.prevGap ?? undefined,
		mob ? 16 : 20,
		0.5,
	);
}
