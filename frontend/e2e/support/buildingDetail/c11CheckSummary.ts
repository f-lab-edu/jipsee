import { C6_TOKENS } from "./c6Tokens";
import { c11Bounds } from "./c11Bounds";
import { C11_BASE, C11_SUMMARY } from "./c11Fixtures";
import type { C11Measure } from "./c11Measure";
import { hexToRgb } from "./hexToRgb";
import type { T } from "./makeT";

/** 건수 줄: 문구, 굵은 건수, 기준 월, 글자 크기, 색, 양끝 정렬, 기준선 정렬, 간격 */
export function c11CheckSummary(
	t: T,
	m: C11Measure,
	layout: "mobile" | "desktop",
	count: number,
	label: string,
) {
	const tk = C6_TOKENS[t.theme];
	const s = m.summary;
	const b = c11Bounds(m, layout);
	t.ok(`${label} 건수 줄이 있음`, !!s, s, "있음");
	if (!s) return;
	const mob = layout === "mobile";
	t.eq(`${label} 앞 문구`, s.label.t, C11_SUMMARY);
	t.eq(`${label} 굵은 건수 문구`, s.count.t, `${count}건`);
	t.eq(`${label} 건수가 strong 요소`, s.count.tag, "STRONG");
	t.eq(`${label} 기준 월 문구`, s.base.t, C11_BASE);
	t.eq(
		`${label} 앞 문구 글자 ${mob ? "15/22" : "16/24"} regular`,
		[s.label.fs, s.label.lh, s.label.fw],
		mob ? ["15px", "22px", "400"] : ["16px", "24px", "400"],
	);
	t.eq(
		`${label} 건수 글자 ${mob ? "15/22" : "16/24"} bold`,
		[s.count.fs, s.count.lh, s.count.fw],
		mob ? ["15px", "22px", "700"] : ["16px", "24px", "700"],
	);
	t.eq(
		`${label} 기준 월 글자 ${mob ? "12/16" : "13/18"} regular`,
		[s.base.fs, s.base.lh, s.base.fw],
		mob ? ["12px", "16px", "400"] : ["13px", "18px", "400"],
	);
	t.color(
		`${label} 앞 문구 색 fg.neutral`,
		s.label.color,
		hexToRgb(tk.fgNeutral),
	);
	t.color(`${label} 건수 색 fg.neutral`, s.count.color, hexToRgb(tk.fgNeutral));
	t.color(
		`${label} 기준 월 색 fg.neutralMuted`,
		s.base.color,
		hexToRgb(tk.fgMuted),
	);
	t.eq(`${label} 줄 display flex`, s.display, "flex");
	t.eq(`${label} 줄 align-items baseline`, s.ai, "baseline");
	t.eq(`${label} 줄 양끝 정렬`, s.jc, "space-between");
	t.eq(
		`${label} 줄 위 padding ${mob ? 4 : 0}`,
		[s.pt, s.pb],
		[mob ? "4px" : "0px", "0px"],
	);
	t.near(
		`${label} 줄 높이 ${mob ? "4 + 22" : 24}`,
		s.rect.h,
		mob ? 26 : 24,
		0.5,
	);
	t.near(
		`${label} 건수 기준선과 기준 월 기준선이 같음`,
		s.countBaseline,
		s.baseBaseline,
		0.5,
	);
	t.near(`${label} 앞 문구 x가 안쪽 왼쪽 끝`, s.label.x, b.l, 1);
	t.near(`${label} 기준 월 오른쪽 끝이 안쪽 오른쪽 끝`, s.base.r, b.r, 1);
	t.near(`${label} 건수가 앞 문구 바로 뒤(공백 포함)`, s.count.x, s.label.r, 1);
	t.near(
		`${label} 줄이 필터 바로 아래 ${mob ? 16 : 20}`,
		s.prevGap ?? undefined,
		mob ? 16 : 20,
		0.5,
	);
	t.near(
		`${label} 줄 아래 간격 ${mob ? 16 : 20}`,
		s.nextGap ?? undefined,
		mob ? 16 : 20,
		0.5,
	);
}
