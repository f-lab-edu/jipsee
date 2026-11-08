import type { Rect } from "./measure";

type TextStyle = {
	fs: string;
	lh: string;
	fw: string;
	color: string;
	ta: string;
};
type TextBox = TextStyle & { text: string; rect: Rect };

export type InfoItem = {
	tags: string;
	wrap: Rect;
	dt: TextBox | null;
	dd: (TextBox & { textRight: number }) | null;
};

export type InfoCard = {
	rect: Rect;
	bw: string;
	bc: string;
	radius: string;
	pad: string;
	title: TextBox | null;
	dl: { rect: Rect; cols: string; gap: string };
	items: InfoItem[];
};

export type InfoMeasure = {
	doc: { vw: number; scrollW: number };
	headerBottom: number | null;
	visibleInfoTitles: number;
	asideAll: number;
	asideVisible: number;
	bodyText: string;
	found: boolean;
	section?: {
		rect: Rect;
		bg: string;
		bw: string;
		bc: string;
		radius: string;
		pad: string;
		labelledBy: string | null;
	};
	h2?: TextBox & { id: string };
	labelledByText?: string | null;
	address?: TextBox | null;
	cards?: InfoCard[];
	base?: TextBox & { textRight: number };
	sectionText?: string;
};

/** 건물 정보 영역 측정. 보이는 "건물 정보" 섹션 하나를 찾아 제목, 주소, 동 카드, 항목, 기준 월을 모음. 페이지 안에서 실행함 */
export function measureInfo(): InfoMeasure {
	const text = (node: Node | null | undefined) =>
		(node?.textContent ?? "").trim();
	const vis = (e: Element | null | undefined) =>
		!!e &&
		e.getClientRects().length > 0 &&
		getComputedStyle(e).visibility !== "hidden";
	const R = (e: Element): Rect => {
		const r = e.getBoundingClientRect();
		return { x: r.x, y: r.y, w: r.width, h: r.height, r: r.right, b: r.bottom };
	};
	const T = (e: Element): TextStyle => {
		const c = getComputedStyle(e);
		return {
			fs: c.fontSize,
			lh: c.lineHeight,
			fw: c.fontWeight,
			color: c.color,
			ta: c.textAlign,
		};
	};
	const box = (e: Element): TextBox => ({
		text: text(e),
		rect: R(e),
		...T(e),
	});
	const textRight = (e: Element) => {
		const rg = document.createRange();
		rg.selectNodeContents(e);
		return rg.getBoundingClientRect().right;
	};
	const header = [...document.querySelectorAll("header")].filter(vis)[0];
	const out: InfoMeasure = {
		doc: {
			vw: document.documentElement.clientWidth,
			scrollW: document.documentElement.scrollWidth,
		},
		headerBottom: header ? header.getBoundingClientRect().bottom : null,
		visibleInfoTitles: [...document.querySelectorAll("h2")].filter(
			(h) => vis(h) && text(h) === "건물 정보",
		).length,
		asideAll: document.querySelectorAll("aside").length,
		asideVisible: [...document.querySelectorAll("aside")].filter(vis).length,
		bodyText: document.body.innerText,
		found: false,
	};
	const sec = [...document.querySelectorAll("section")]
		.filter(vis)
		.find((s) => text(s.querySelector("h2")) === "건물 정보");
	const h2 = sec?.querySelector("h2");
	if (!sec || !h2) return out;
	out.found = true;
	const sc = getComputedStyle(sec);
	out.section = {
		rect: R(sec),
		bg: sc.backgroundColor,
		bw: sc.borderTopWidth,
		bc: sc.borderTopColor,
		radius: sc.borderTopLeftRadius,
		pad: [
			sc.paddingTop,
			sc.paddingRight,
			sc.paddingBottom,
			sc.paddingLeft,
		].join(" "),
		labelledBy: sec.getAttribute("aria-labelledby"),
	};
	out.h2 = { ...box(h2), id: h2.id };
	const labelledBy = sec.getAttribute("aria-labelledby");
	const labelEl = labelledBy ? document.getElementById(labelledBy) : null;
	out.labelledByText = labelEl ? text(labelEl) : null;
	const addr = [...(h2.parentElement?.children ?? [])].find(
		(e) => e !== h2 && vis(e) && text(e),
	);
	out.address = addr ? box(addr) : null;
	out.cards = [...sec.querySelectorAll("dl")].map((dl) => {
		const card = dl.parentElement as HTMLElement;
		const cc = getComputedStyle(card);
		const h3 = card.querySelector("h3");
		const dlStyle = getComputedStyle(dl);
		return {
			rect: R(card),
			bw: cc.borderTopWidth,
			bc: cc.borderTopColor,
			radius: cc.borderTopLeftRadius,
			pad: [
				cc.paddingTop,
				cc.paddingRight,
				cc.paddingBottom,
				cc.paddingLeft,
			].join(" "),
			title: h3 ? box(h3) : null,
			dl: {
				rect: R(dl),
				cols: dlStyle.gridTemplateColumns,
				gap: `${dlStyle.rowGap} ${dlStyle.columnGap}`,
			},
			items: [...dl.children].map((w) => {
				const dt = w.querySelector("dt");
				const dd = w.querySelector("dd");
				return {
					tags: [...w.children].map((c) => c.tagName.toLowerCase()).join(","),
					wrap: R(w),
					dt: dt ? box(dt) : null,
					dd: dd ? { ...box(dd), textRight: textRight(dd) } : null,
				};
			}),
		};
	});
	// 기준 월 줄 아래에 외부 링크 영역이 붙으므로 마지막 자식이 아니라 문구로 찾음
	const base =
		[...sec.querySelectorAll("*")]
			.filter(
				(e) => e.children.length === 0 && /^건축물대장 .* 기준$/.test(text(e)),
			)
			.pop() ?? sec.lastElementChild;
	if (base) out.base = { ...box(base), textRight: textRight(base) };
	out.sectionText = (sec as HTMLElement).innerText;
	return out;
}
