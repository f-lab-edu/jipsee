import type { Rect } from "./measure";

export type LinkMeasure = {
	text: string;
	href: string | null;
	target: string | null;
	rel: string | null;
	rect: Rect;
	bg: string;
	radius: string;
	pl: string;
	pr: string;
	bw: string;
	jc: string;
	label: { fs: string; fw: string; color: string; left: number } | null;
	svg: (Rect & { color: string }) | null;
	afterBase: boolean | null;
	parent: { rowGap: string; colGap: string; linkCount: number } | null;
};

export type LinksMeasure = {
	found: boolean;
	tokenBg?: string;
	base?: { text: string; rect: Rect } | null;
	allAnchors?: number;
	links: LinkMeasure[];
};

/** 보이는 건물 정보 섹션 안의 외부 링크를 측정함. 페이지 안에서 실행하므로 외부 변수를 쓰지 않음 */
export function c5MeasureLinks(): LinksMeasure {
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
	const out: LinksMeasure = { found: false, links: [] };
	const sec = [...document.querySelectorAll("section")]
		.filter(vis)
		.find((s) => text(s.querySelector("h2")) === "건물 정보");
	if (!sec) return out;
	out.found = true;
	const probe = document.createElement("div");
	probe.style.background = "var(--seed-color-bg-neutral-weak)";
	document.body.appendChild(probe);
	out.tokenBg = getComputedStyle(probe).backgroundColor;
	probe.remove();
	const base = [...sec.querySelectorAll("*")]
		.filter(
			(e) => e.children.length === 0 && /^건축물대장 .* 기준$/.test(text(e)),
		)
		.pop();
	out.base = base ? { text: text(base), rect: R(base) } : null;
	out.allAnchors = [...document.querySelectorAll("a")].filter(
		(a) => vis(a) && ["공시가격알리미", "안심전세 앱"].includes(text(a)),
	).length;
	out.links = [...sec.querySelectorAll("a")].filter(vis).map((a) => {
		const cs = getComputedStyle(a);
		const label = [...a.querySelectorAll("*")].find(
			(e) => !(e instanceof SVGElement) && e.children.length === 0 && text(e),
		);
		const lc = label ? getComputedStyle(label) : null;
		const rg = document.createRange();
		rg.selectNodeContents(label || a);
		const tr = rg.getBoundingClientRect();
		const svg = a.querySelector("svg");
		const parent = a.parentElement;
		return {
			text: text(a),
			href: a.getAttribute("href"),
			target: a.getAttribute("target"),
			rel: a.getAttribute("rel"),
			rect: R(a),
			bg: cs.backgroundColor,
			radius: cs.borderTopLeftRadius,
			pl: cs.paddingLeft,
			pr: cs.paddingRight,
			bw: cs.borderTopWidth,
			jc: cs.justifyContent,
			label: lc
				? {
						fs: lc.fontSize,
						fw: lc.fontWeight,
						color: lc.color,
						left: tr.left,
					}
				: null,
			svg: svg ? { ...R(svg), color: getComputedStyle(svg).color } : null,
			afterBase: base
				? !!(base.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_FOLLOWING)
				: null,
			parent: parent
				? {
						rowGap: getComputedStyle(parent).rowGap,
						colGap: getComputedStyle(parent).columnGap,
						linkCount: parent.querySelectorAll(":scope > a").length,
					}
				: null,
		};
	});
	return out;
}
