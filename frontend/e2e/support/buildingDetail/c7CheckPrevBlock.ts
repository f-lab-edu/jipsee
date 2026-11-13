import type { C6Tokens } from "./c6Tokens";
import { PREV_DESC, PREV_TITLE } from "./c7PrevDeal";
import { hexToRgb } from "./hexToRgb";
import type { T } from "./makeT";
import type { DealsMeasure } from "./measureDeals";

/** 블록 껍데기: 제목, 설명, 간격, 순서, 목록 라벨 */
export function c7CheckPrevBlock(
	t: T,
	m: DealsMeasure,
	layout: "mobile" | "desktop",
	tk: C6Tokens,
	rowX: number,
) {
	const b = m.block;
	t.eq("보이는 이전 건물 거래 제목 개수", b?.visibleCount, 1);
	t.eq(
		"블록이 거래 이력 섹션의 마지막 직접 자식이고 섹션 제목 뒤에 있음",
		[b?.parentIsSection, b?.isLastChildOfSection, b?.afterTitle],
		[true, true, true],
	);
	t.eq("제목 문구와 태그 h3", [b?.h3?.text, b?.h3?.tag], [PREV_TITLE, "H3"]);
	t.eq(
		"제목 글자 16/22 bold",
		[b?.h3?.fs, b?.h3?.lh, b?.h3?.fw],
		["16px", "22px", "700"],
	);
	t.color("제목 색 fg.neutral", b?.h3?.color, hexToRgb(tk.fgNeutral));
	t.near("제목 높이 22", b?.h3?.rect.h, 22, 0.5);
	t.near("제목 x (목록 왼쪽 끝과 같음)", b?.h3?.rect.x, rowX, 1);
	t.eq("설명 문구와 태그 p", [b?.p?.text, b?.p?.tag], [PREV_DESC, "P"]);
	t.eq(
		"설명 글자 13/18 400",
		[b?.p?.fs, b?.p?.lh, b?.p?.fw],
		["13px", "18px", "400"],
	);
	t.color("설명 색 fg.neutralMuted", b?.p?.color, hexToRgb(tk.fgMuted));
	t.near("설명 x", b?.p?.rect.x, rowX, 1);
	t.near(
		"제목과 설명 간격 4",
		(b?.p?.rect.y ?? Number.NaN) - (b?.h3?.rect.b ?? Number.NaN),
		4,
		0.5,
	);
	const mobile = layout === "mobile";
	t.near(
		`설명과 목록 간격 ${mobile ? 4 : 8}`,
		(b?.list?.rect.y ?? Number.NaN) - (b?.p?.rect.b ?? Number.NaN),
		mobile ? 4 : 8,
		0.5,
	);
	t.eq(`블록 padding-top ${mobile ? 4 : 0}`, b?.padTop, mobile ? "4px" : "0px");
	t.near(
		"블록 위쪽 끝과 제목 위쪽 끝 간격 (padding-top)",
		(b?.h3?.rect.y ?? Number.NaN) - (b?.rect?.y ?? Number.NaN),
		mobile ? 4 : 0,
		0.5,
	);
	t.eq(
		"제목, 설명, 목록 순서(위에서 아래)",
		[
			(b?.h3?.rect.b ?? 0) <= (b?.p?.rect.y ?? 0) + 0.5,
			(b?.p?.rect.b ?? 0) <= (b?.list?.rect.y ?? 0) + 0.5,
		],
		[true, true],
	);
	t.near("목록 x", b?.list?.rect.x, rowX, 1);
	t.eq(
		"블록 안 문구가 제목, 설명, 거래 값뿐이고 해제와 유사 건물이 없음",
		[
			/해제|유사 건물/.test(b?.text ?? ""),
			(b?.text ?? "").includes(PREV_TITLE),
			(b?.text ?? "").includes(PREV_DESC),
		],
		[false, true, true],
	);
	if (mobile) {
		t.eq(
			"모바일 목록은 ul이고 table이 아님",
			[b?.list?.tag, b?.list?.role],
			["UL", null],
		);
	} else {
		t.eq(
			"데스크톱 목록은 role=table이고 aria-label이 이전 건물 거래",
			[b?.list?.role, b?.list?.label],
			["table", PREV_TITLE],
		);
	}
}
