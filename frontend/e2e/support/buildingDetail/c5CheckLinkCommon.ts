import { LINKS } from "./c5Links";
import type { LinksMeasure } from "./c5MeasureLinks";
import type { T } from "./makeT";

export function c5CheckLinkCommon(t: T, m: LinksMeasure, label: string) {
	t.ok(`${label} 건물 정보 섹션이 보임`, m.found, m.found, "있음");
	t.eq(
		`${label} 문서에서 보이는 외부 링크 개수 (숨은 레이아웃 제외)`,
		m.allAnchors,
		2,
	);
	t.eq(`${label} 링크 개수`, m.links.length, 2);
	t.eq(
		`${label} 링크 순서와 글자`,
		m.links.map((l) => l.text),
		LINKS.map((l) => l.text),
	);
	t.eq(
		`${label} href`,
		m.links.map((l) => l.href),
		LINKS.map((l) => l.href),
	);
	for (const l of m.links) {
		t.eq(`${label} ${l.text} target`, l.target, "_blank");
		t.ok(
			`${label} ${l.text} rel에 noopener와 noreferrer`,
			/\bnoopener\b/.test(l.rel || "") && /\bnoreferrer\b/.test(l.rel || ""),
			l.rel,
			"noopener noreferrer 포함",
		);
		t.near(`${label} ${l.text} 높이`, l.rect.h, 48, 0.5);
		t.eq(`${label} ${l.text} 둥글기`, l.radius, "12px");
		t.eq(`${label} ${l.text} border 없음`, l.bw, "0px");
		t.eq(`${label} ${l.text} justify-content`, l.jc, "space-between");
		t.eq(
			`${label} ${l.text} 글자 14px/500`,
			[l.label?.fs, l.label?.fw],
			["14px", "500"],
		);
		t.near(`${label} ${l.text} 아이콘 w`, l.svg?.w, 16, 0.1);
		t.near(`${label} ${l.text} 아이콘 h`, l.svg?.h, 16, 0.1);
		t.ok(
			`${label} ${l.text} 건축물대장 기준 월 줄 뒤에 있음`,
			l.afterBase === true,
			l.afterBase,
			"true",
		);
		t.ok(
			`${label} ${l.text} 기준 월 줄 아래에 위치`,
			!!m.base && l.rect.y >= m.base.rect.b - 0.5,
			`${l.rect.y} vs ${m.base?.rect.b}`,
			"링크 위쪽 ≥ 기준 월 줄 아래쪽",
		);
	}
}
