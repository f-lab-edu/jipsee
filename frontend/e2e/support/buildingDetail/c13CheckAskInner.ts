import { ASK_GUIDE, ASK_LOCK_PATH, ASK_TEXT, ASK_TOKENS } from "./c13Fixtures";
import type { AskMeasure } from "./c13MeasureAsk";
import type { T } from "./makeT";

export type AskGeom = {
	btnX: number;
	btnY: number;
	btnW: number;
	btnH: number;
	btnRadius: string;
	guideGap: number;
	noGuide: boolean;
};

/** 공통 확인: 모바일 바와 데스크톱 카드가 안쪽 버튼과 안내를 같은 방식으로 가짐 */
export function c13CheckAskInner(
	t: T,
	m: AskMeasure,
	label: string,
	g: AskGeom,
) {
	const { btn, btnIcon, guide } = m;
	t.ok(`${label} 질문하기 링크가 있음`, !!btn, btn, "링크가 있음");
	if (!btn) return;
	t.eq(`${label} 버튼은 링크(a)`, btn.tag, "A");
	t.eq(`${label} 버튼 문구`, btn.text, ASK_TEXT);
	t.eq(`${label} 새 탭으로 열지 않음`, btn.target, null);
	t.near(`${label} 버튼 x`, btn.x, g.btnX);
	t.near(`${label} 버튼 y`, btn.y, g.btnY);
	t.near(`${label} 버튼 w`, btn.w, g.btnW);
	t.near(`${label} 버튼 h`, btn.h, g.btnH);
	t.eq(`${label} 버튼 radius`, btn.radius, g.btnRadius);
	t.color(`${label} 버튼 배경`, btn.bg, ASK_TOKENS[t.theme].buttonBg);
	t.color(`${label} 버튼 글자색`, btn.tcolor, ASK_TOKENS[t.theme].fgOnBrand);
	t.eq(`${label} 버튼 글자 크기`, btn.fs, "16px");
	t.eq(`${label} 버튼 글자 굵기`, btn.fw, "700");
	t.eq(`${label} 버튼 가운데 정렬`, [btn.ai, btn.jc], ["center", "center"]);
	t.eq(`${label} 아이콘과 문구 간격`, btn.gap, "8px");
	t.ok(`${label} 버튼 아이콘이 있음`, !!btnIcon, btnIcon, "말풍선 svg가 있음");
	if (btnIcon) {
		t.near(`${label} 아이콘 w`, btnIcon.w, 20);
		t.near(`${label} 아이콘 h`, btnIcon.h, 20);
		t.near(
			`${label} 아이콘 y (버튼 가운데)`,
			btnIcon.y,
			btn.y + (btn.h - 20) / 2,
		);
		t.color(`${label} 아이콘 색`, btnIcon.color, ASK_TOKENS[t.theme].fgOnBrand);
		t.eq(`${label} 아이콘 모양(말풍선)`, btnIcon.d, "M4 5h16v11H9l-5 4z");
		t.eq(`${label} 아이콘 aria-hidden`, btnIcon.ariaHidden, "true");
		t.near(
			`${label} 아이콘 오른쪽과 문구 왼쪽 간격 8`,
			btn.tr.x - btnIcon.r,
			8,
			1.5,
		);
		t.near(
			`${label} 아이콘과 문구 묶음이 가운데 (왼쪽 여백 = 오른쪽 여백)`,
			btnIcon.x - btn.x,
			btn.r - btn.tr.r,
			1.5,
		);
	}
	if (g.noGuide) {
		t.eq(`${label} 안내 한 줄이 없음`, m.guide, null);
		return;
	}
	t.ok(`${label} 안내 한 줄이 있음`, !!guide, guide, "있음");
	if (!guide) return;
	t.eq(`${label} 안내 문구`, guide.text, ASK_GUIDE);
	t.near(`${label} 안내 x`, guide.x, g.btnX);
	t.near(`${label} 안내 y (버튼 아래 간격)`, guide.y, btn.b + g.guideGap);
	t.near(`${label} 안내 w`, guide.w, g.btnW);
	t.near(`${label} 안내 h`, guide.h, 18);
	t.eq(
		`${label} 안내 글자 크기와 줄 높이`,
		[guide.fs, guide.lh, guide.fw],
		["13px", "18px", "400"],
	);
	t.color(
		`${label} 안내 글자색 fg.neutralMuted`,
		guide.color,
		t.tokens.fgMuted,
	);
	t.eq(`${label} 안내 가운데 정렬`, [guide.ai, guide.jc], ["center", "center"]);
	t.eq(`${label} 아이콘과 문구 간격`, guide.gap, "4px");
	t.near(`${label} 안내 아이콘 w`, guide.icon.w, 14);
	t.near(`${label} 안내 아이콘 h`, guide.icon.h, 14);
	t.color(`${label} 안내 아이콘 색`, guide.icon.color, t.tokens.fgMuted);
	t.eq(`${label} 안내 아이콘 모양(잠금)`, guide.icon.d, ASK_LOCK_PATH);
	t.eq(`${label} 안내 아이콘 aria-hidden`, guide.icon.ariaHidden, "true");
	t.near(
		`${label} 안내 아이콘 오른쪽과 문구 왼쪽 간격 4`,
		guide.tr.x - guide.icon.r,
		4,
		1.5,
	);
	t.near(
		`${label} 안내 묶음이 가운데`,
		guide.icon.x - guide.x,
		guide.r - guide.tr.r,
		1.5,
	);
}
