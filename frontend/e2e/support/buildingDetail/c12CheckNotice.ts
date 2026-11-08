import { C12_BODY, C12_TOKENS, type C12State } from "./c12Fixtures";
import { c12Notices } from "./c12Notices";
import { hexToRgb } from "./hexToRgb";
import type { T } from "./makeT";
import type { NearbyDealsMeasure } from "./measureNearbyDeals";

/** 조건 확장 안내 상자의 문구, 글자, 색, 모양, 위치를 확인함 */
export function c12CheckNotice(
	t: T,
	m: NearbyDealsMeasure,
	layout: "mobile" | "desktop",
	st: C12State,
	label: string,
) {
	const k = C12_TOKENS[t.theme];
	const mob = layout === "mobile";
	const ns = c12Notices(m);
	t.eq(`${label} 조건 확장 안내 개수`, ns.length, 1);
	const n = ns[0];
	if (!n) return;
	const nan = Number.NaN;
	t.eq(`${label} role="note"`, n.role, "note");
	t.eq(
		`${label} 제목과 본문 문구`,
		n.texts.map((x) => x.t),
		[st.title, C12_BODY],
	);
	t.eq(
		`${label} 제목 글자 14/20 bold`,
		[n.texts[0]?.fs, n.texts[0]?.lh, n.texts[0]?.fw],
		["14px", "20px", "700"],
	);
	t.eq(
		`${label} 본문 글자 14/20 regular`,
		[n.texts[1]?.fs, n.texts[1]?.lh, n.texts[1]?.fw],
		["14px", "20px", "400"],
	);
	t.color(`${label} 배경 bg.warningWeak`, n.bg, hexToRgb(k.bg));
	t.color(
		`${label} 제목 글자색 fg.warningContrast`,
		n.texts[0]?.color,
		hexToRgb(k.fg),
	);
	t.color(
		`${label} 본문 글자색 fg.warningContrast`,
		n.texts[1]?.color,
		hexToRgb(k.fg),
	);
	t.color(`${label} 아이콘색 fg.warningContrast`, n.svg?.color, hexToRgb(k.fg));
	t.eq(
		`${label} 둥글기 12, 아이콘과 문구 간격 10`,
		[n.radius, n.gap],
		["12px", "10px"],
	);
	t.eq(`${label} 위쪽 정렬`, n.align, "flex-start");
	t.eq(
		`${label} padding ${mob ? "14/16" : "14/18"}`,
		n.pad,
		mob ? "14px 16px 14px 16px" : "14px 18px 14px 18px",
	);
	t.eq(`${label} 아이콘 aria-hidden`, n.svg?.ariaHidden, "true");
	t.near(`${label} 아이콘 크기 ${mob ? 18 : 20}`, n.svg?.w, mob ? 18 : 20, 0.5);
	t.near(`${label} 아이콘 높이`, n.svg?.h, mob ? 18 : 20, 0.5);
	t.near(
		`${label} 아이콘 y(상자 위 + 14${mob ? " + 1" : ""})`,
		n.svg?.y,
		n.y + (mob ? 15 : 14),
		0.5,
	);
	t.near(
		`${label} 아이콘 x(상자 x + ${mob ? 16 : 18})`,
		n.svg?.x,
		n.x + (mob ? 16 : 18),
		0.5,
	);
	t.near(
		`${label} 문구 x(아이콘 오른쪽 + 10)`,
		n.texts[0]?.x,
		(n.svg?.x ?? nan) + (n.svg?.w ?? nan) + 10,
		0.5,
	);
	t.near(`${label} 본문 x가 제목 x와 같음`, n.texts[1]?.x, n.texts[0]?.x, 0.5);
	// 글자 상자는 줄 높이 20 안에서 위 1.5 아래 1.5 여백이 생김
	t.near(
		`${label} 제목 위치(상자 위 + padding 14 + 줄 여백)`,
		n.texts[0]?.y,
		n.y + 15.5,
		1,
	);
	t.near(
		`${label} 제목과 본문 간격(줄 20 + 간격 2)`,
		(n.texts[1]?.y ?? nan) - (n.texts[0]?.y ?? nan),
		22,
		0.5,
	);
	t.near(`${label} 상자 높이(14 + 20 + 2 + 20 + 14)`, n.h, 70, 0.5);
	t.ok(`${label} 상자 높이 50 이상`, n.h >= 49.5, n.h, "≥ 50");
	if (mob) {
		t.near(
			`${label} 상자 x(섹션 x + 16)`,
			n.x,
			(m.section?.x ?? nan) + 16,
			0.5,
		);
		t.near(
			`${label} 상자 w(섹션 w - 32)`,
			n.w,
			(m.section?.w ?? nan) - 32,
			0.5,
		);
	} else {
		t.near(
			`${label} 상자 x(카드 x + border 1 + padding 32)`,
			n.x,
			(m.section?.x ?? nan) + 33,
			0.5,
		);
		t.near(
			`${label} 상자 w(카드 w - 66)`,
			n.w,
			(m.section?.w ?? nan) - 66,
			0.5,
		);
	}
	t.ok(
		`${label} 제목과 본문이 한 줄씩`,
		(n.texts[0]?.h ?? 99) <= 20 && (n.texts[1]?.h ?? 99) <= 20,
		[n.texts[0]?.h, n.texts[1]?.h],
		"각 한 줄(≤ 20)",
	);
}
