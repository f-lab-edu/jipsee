import { C6_TOKENS } from "./c6Tokens";
import { C10_TOKENS } from "./c10Fixtures";
import type { C10Measure } from "./c10MeasureNearby";
import { C10_NOTICE } from "./c10Notice";
import { hexToRgb } from "./hexToRgb";
import type { T } from "./makeT";

/** 위치 정보 없음 안내 상자 */
export function c10CheckNotice(
	t: T,
	m: C10Measure,
	layout: "mobile" | "desktop",
	label: string,
) {
	const tk = C6_TOKENS[t.theme];
	const k = C10_TOKENS[t.theme];
	const n = m.notice;
	const mobile = layout === "mobile";
	t.eq(`${label} 안내 문구`, n?.text, C10_NOTICE);
	t.eq(`${label} 안내 role="note"`, n?.role, "note");
	t.eq(`${label} 섹션 안 note 개수`, m.noteCount, 1);
	t.color(`${label} 안내 배경 bg.neutralWeak`, n?.bg, hexToRgb(k.neutralWeak));
	t.color(`${label} 안내 글자색 fg.neutral`, n?.color, hexToRgb(tk.fgNeutral));
	t.eq(`${label} 안내 둥글기 12`, n?.radius, "12px");
	t.eq(
		`${label} 안내 min-height(Seed Box는 content-box라 50에서 위아래 padding를 뺀 값)`,
		n?.minH,
		mobile ? "22px" : "18px",
	);
	t.eq(
		`${label} 안내 padding`,
		n?.pad,
		mobile ? "14px 16px 14px 16px" : "16px 18px 16px 18px",
	);
	t.eq(`${label} 안내 정렬`, n?.align, mobile ? "flex-start" : "center");
	t.near(
		`${label} 안내 아이콘과 문구 간격 10`,
		(n?.textRect?.x ?? Number.NaN) - (n?.svg?.rect.r ?? Number.NaN),
		10,
		1,
	);
	t.eq(
		`${label} 안내 글자 ${mobile ? "14/20" : "15/22"} regular`,
		[n?.fs, n?.lh, n?.fw],
		mobile ? ["14px", "20px", "400"] : ["15px", "22px", "400"],
	);
	t.eq(`${label} 안내 문구는 p`, n?.tag, "P");
	t.near(`${label} 안내 아이콘 크기`, n?.svg?.rect.w, mobile ? 18 : 20, 0.5);
	t.near(`${label} 안내 아이콘 높이`, n?.svg?.rect.h, mobile ? 18 : 20, 0.5);
	t.eq(`${label} 안내 아이콘 aria-hidden`, n?.svg?.ariaHidden, "true");
	t.near(
		`${label} 안내 높이(max(50, padding 합 + 문구 높이))`,
		n?.rect?.h,
		Math.max(50, (mobile ? 28 : 32) + (n?.pRect?.h ?? 0)),
		1,
	);
	if (!mobile) {
		t.near(`${label} 안내 문구 한 줄 높이 22`, n?.pRect?.h, 22, 0.5);
	}
	if (mobile) {
		t.near(
			`${label} 안내 아이콘 위 margin 1`,
			(n?.svg?.rect.y ?? Number.NaN) - (n?.rect?.y ?? Number.NaN),
			14 + 1,
			1,
		);
		t.near(`${label} 안내 x`, n?.rect?.x, 16, 0.5);
		t.near(`${label} 안내 w`, n?.rect?.w, m.vw - 32, 0.5);
	}
	t.near(
		`${label} 제목 아래 안내 간격`,
		(n?.rect?.y ?? Number.NaN) - (m.title?.rect.b ?? Number.NaN),
		mobile ? 16 : 20,
		1,
	);
	t.eq(`${label} 필터 그룹 없음`, m.groups?.length, 0);
	t.eq(`${label} 면적 줄 없음`, m.area, null);
}
