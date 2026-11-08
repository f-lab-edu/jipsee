import type { Rect } from "./measure";

type DealStyle = {
	fs: string;
	lh: string;
	fw: string;
	color: string;
	td: string;
};
type RelRect = {
	x: number;
	y: number;
	w: number;
	h: number;
	r: number;
	b: number;
	cy: number;
};
type DealText = { text: string; t: RelRect } & DealStyle;

export type DealBadge = DealText & {
	box: RelRect;
	bg: string;
	shadow: string;
	radius: string;
	pad: string;
};

export type DealRow = {
	rect: Rect;
	badges: DealBadge[];
	date: DealText;
	area: DealText;
	amount: DealText;
	border?: { bw: string; bc: string; padY: string };
	cells?: { x: number; w: number }[];
	amountBox?: RelRect & { shrink: string; maxW: string };
};

export type DealsMeasure = {
	vw: number;
	scrollW: number;
	dupIds: string[];
	titleIds: Record<
		string,
		{
			count: number;
			text: string | null;
			tag: string | null;
			sections: number;
			sectionVisible: number;
			titleInSection: boolean;
		}
	>;
	visibleSections: number;
	found: boolean;
	section?: {
		rect: Rect;
		pad: string;
		bg: string;
		bw: string;
		bc: string;
		radius: string;
		labelledBy: string | null;
	};
	title?: ({ text: string; id: string; rect: Rect } & DealStyle) | null;
	prev?: {
		rect: Rect;
		bg: string;
		h: string;
		prevBottom: number | null;
	} | null;
	table?: {
		label: string | null;
		tag: string;
		rowRoles: number;
		headerCount: number;
		cellCount: number;
	} | null;
	ulLabels?: (string | null)[];
	ulCount?: number;
	liCount?: number;
	header?: {
		rect: Rect;
		pad: string;
		bw: string;
		bc: string;
		cells: ({ text: string; t: RelRect } & DealStyle)[];
	};
	rows: DealRow[];
	block?: {
		domTotal: number;
		visibleCount: number;
		bodyHasDescription: boolean;
		parentIsSection?: boolean;
		isLastChildOfSection?: boolean;
		afterTitle?: boolean;
		padTop?: string;
		gap?: string;
		headingGap?: string;
		rect?: Rect;
		h3?: { text: string; tag: string; rect: Rect } & DealStyle;
		p?: ({ text: string; tag: string; rect: Rect } & DealStyle) | null;
		list?: {
			tag: string;
			role: string | null;
			label: string | null;
			rect: Rect;
		} | null;
		text?: string;
	};
};

/** 보이는 거래 이력 섹션과 거래 목록을 측정함. scope가 "prev"면 이전 건물 거래 블록 안만, "current"면 블록 밖만 봄. 페이지 안에서 실행하므로 외부 변수를 쓰지 않음 */
export function measureDeals(
	scope: "current" | "prev" = "current",
): DealsMeasure {
	const text = (node: Node | null | undefined) =>
		(node?.textContent ?? "").trim();
	const vis = (e: Element | null | undefined) =>
		!!e &&
		e.getClientRects().length > 0 &&
		getComputedStyle(e).visibility !== "hidden";
	const toRect = (r: DOMRect): Rect => ({
		x: r.x,
		y: r.y,
		w: r.width,
		h: r.height,
		r: r.right,
		b: r.bottom,
	});
	const R = (e: Element) => toRect(e.getBoundingClientRect());
	const TR = (e: Element) => {
		const rg = document.createRange();
		rg.selectNodeContents(e);
		return toRect(rg.getBoundingClientRect());
	};
	const rel = (r: Rect, o: Rect): RelRect => ({
		x: r.x - o.x,
		y: r.y - o.y,
		w: r.w,
		h: r.h,
		r: r.r - o.x,
		b: r.b - o.y,
		cy: r.y + r.h / 2 - o.y,
	});
	const effTd = (el: Element) => {
		for (
			let e: Element | null = el;
			e && e !== document.body;
			e = e.parentElement
		) {
			const d = getComputedStyle(e).textDecorationLine;
			if (d !== "none") return d;
		}
		return "none";
	};
	const sty = (e: Element): DealStyle => {
		const c = getComputedStyle(e);
		return {
			fs: c.fontSize,
			lh: c.lineHeight,
			fw: c.fontWeight,
			color: c.color,
			td: effTd(e),
		};
	};
	const doc = document.documentElement;
	const allIds = [...document.querySelectorAll("[id]")].map((e) => e.id);
	const titleIds: DealsMeasure["titleIds"] = {};
	for (const l of ["mobile", "desktop"]) {
		const id = `deal-history-title-${l}`;
		const e = document.getElementById(id);
		const secs = [
			...document.querySelectorAll(`section[aria-labelledby="${id}"]`),
		];
		titleIds[l] = {
			count: allIds.filter((x) => x === id).length,
			text: e ? text(e) : null,
			tag: e ? e.tagName : null,
			sections: secs.length,
			sectionVisible: secs.filter(vis).length,
			titleInSection: !!e && secs.length === 1 && secs[0].contains(e),
		};
	}
	const sections = [
		...document.querySelectorAll(
			'section[aria-labelledby^="deal-history-title"]',
		),
	];
	const out: DealsMeasure = {
		vw: doc.clientWidth,
		scrollW: doc.scrollWidth,
		dupIds: [...new Set(allIds.filter((id, i) => allIds.indexOf(id) !== i))],
		titleIds,
		visibleSections: sections.filter(vis).length,
		found: false,
		rows: [],
	};
	const sec = sections.filter(vis)[0];
	if (!sec) return out;
	out.found = true;
	const sc = getComputedStyle(sec);
	out.section = {
		rect: R(sec),
		pad: [
			sc.paddingTop,
			sc.paddingRight,
			sc.paddingBottom,
			sc.paddingLeft,
		].join(" "),
		bg: sc.backgroundColor,
		bw: sc.borderTopWidth,
		bc: sc.borderTopColor,
		radius: sc.borderTopLeftRadius,
		labelledBy: sec.getAttribute("aria-labelledby"),
	};
	const h2 = sec.querySelector("h2");
	out.title = h2
		? { text: text(h2), id: h2.id, rect: R(h2), ...sty(h2) }
		: null;
	const prev = sec.previousElementSibling;
	out.prev = prev
		? {
				rect: R(prev),
				bg: getComputedStyle(prev).backgroundColor,
				h: getComputedStyle(prev).height,
				prevBottom: prev.previousElementSibling
					? R(prev.previousElementSibling).b
					: null,
			}
		: null;

	// 이전 건물 거래 블록은 섹션의 직접 자식이고 제목(h3)의 할아버지임
	const prevH3 = [...sec.querySelectorAll("h3")].find(
		(h) => text(h) === "이전 건물 거래",
	);
	const prevBlock = prevH3?.parentElement?.parentElement ?? null;
	const scopeOk = (e: Element) =>
		scope === "prev"
			? !!prevBlock && prevBlock.contains(e)
			: !(prevBlock?.contains(e) ?? false);
	const table =
		[...sec.querySelectorAll('[role="table"]')].find(scopeOk) ?? null;
	out.table = table
		? {
				label: table.getAttribute("aria-label"),
				tag: table.tagName,
				rowRoles: table.querySelectorAll('[role="row"]').length,
				headerCount: table.querySelectorAll('[role="columnheader"]').length,
				cellCount: table.querySelectorAll('[role="cell"]').length,
			}
		: null;
	const uls = [...sec.querySelectorAll("ul")].filter(scopeOk);
	out.ulLabels = uls.map((u) => u.getAttribute("aria-label"));
	out.ulCount = uls.length;
	out.liCount = uls.reduce((n, u) => n + u.children.length, 0);

	let headerEl: Element | null = null;
	let rowEls: Element[] = [];
	if (table) {
		const all = [...table.querySelectorAll('[role="row"]')];
		headerEl =
			all.find((r) => r.querySelector('[role="columnheader"]')) ?? null;
		rowEls = all.filter((r) => r !== headerEl);
	} else if (uls[0]) {
		rowEls = [...uls[0].children].filter((e) => e.tagName === "LI");
	}

	if (headerEl) {
		const hr = R(headerEl);
		const hc = getComputedStyle(headerEl);
		out.header = {
			rect: hr,
			pad: hc.padding,
			bw: hc.borderBottomWidth,
			bc: hc.borderBottomColor,
			cells: [...headerEl.querySelectorAll('[role="columnheader"]')].map(
				(c) => {
					const leaf =
						[c, ...c.querySelectorAll("*")]
							.filter((e) => e.children.length === 0 && text(e))
							.pop() ?? c;
					return { text: text(c), t: rel(TR(leaf), hr), ...sty(leaf) };
				},
			),
		};
	}

	const leafOf = (root: Element) =>
		[root, ...root.querySelectorAll("*")].filter(
			(e) => e.children.length === 0 && text(e),
		);
	const badgeBox = (leaf: Element, row: Element) => {
		for (let e: Element | null = leaf; e && e !== row; e = e.parentElement) {
			const c = getComputedStyle(e);
			if (c.backgroundColor !== "rgba(0, 0, 0, 0)" || c.boxShadow !== "none") {
				return e;
			}
		}
		return leaf;
	};
	out.rows = rowEls.map((row) => {
		const rr = R(row);
		let cells: Element[] | null = null;
		let badgeLeaves: Element[];
		let dateLeaf: Element;
		let areaLeaf: Element;
		let amountLeaf: Element;
		if (table) {
			cells = [...row.querySelectorAll('[role="cell"]')];
			const leaves = cells.map((c) => leafOf(c));
			[badgeLeaves, dateLeaf, areaLeaf, amountLeaf] = [
				leaves[1],
				leaves[0][0],
				leaves[2][0],
				leaves[3][0],
			];
		} else {
			const all = leafOf(row);
			[badgeLeaves, dateLeaf, areaLeaf, amountLeaf] = [
				all.slice(0, -3),
				all[all.length - 3],
				all[all.length - 2],
				all[all.length - 1],
			];
		}
		const mk = (leaf: Element) => ({
			text: text(leaf),
			t: rel(TR(leaf), rr),
			...sty(leaf),
		});
		const o: DealRow = {
			rect: rr,
			badges: badgeLeaves.map((leaf) => {
				const bx = badgeBox(leaf, row);
				const bc = getComputedStyle(bx);
				return {
					...mk(leaf),
					box: rel(R(bx), rr),
					bg: bc.backgroundColor,
					shadow: bc.boxShadow,
					radius: bc.borderTopLeftRadius,
					pad: bc.padding,
				};
			}),
			date: mk(dateLeaf),
			area: mk(areaLeaf),
			amount: mk(amountLeaf),
		};
		// 아래 border와 위아래 padding: 행 자신이나 행 전체 폭을 덮는 안쪽 요소
		const bEl = [row, ...row.querySelectorAll("*")].find(
			(e) =>
				parseFloat(getComputedStyle(e).borderBottomWidth) > 0 &&
				Math.abs(e.getBoundingClientRect().width - rr.w) < 1.5 &&
				Math.abs(e.getBoundingClientRect().bottom - rr.b) < 1.5,
		);
		if (bEl) {
			const c = getComputedStyle(bEl);
			o.border = {
				bw: c.borderBottomWidth,
				bc: c.borderBottomColor,
				padY: `${c.paddingTop} ${c.paddingBottom}`,
			};
		}
		if (cells) {
			o.cells = cells.map((c) => {
				const r = rel(R(c), rr);
				return { x: r.x, w: r.w };
			});
		}
		if (!table) {
			let e: Element | null = amountLeaf;
			while (e && !e.previousElementSibling && e !== row) e = e.parentElement;
			if (e) {
				const c = getComputedStyle(e);
				o.amountBox = {
					...rel(R(e), rr),
					shrink: c.flexShrink,
					maxW: c.maxWidth,
				};
			}
		}
		return o;
	});
	// 이전 건물 거래 블록 (보이는 것 기준)
	const h3s = [...document.querySelectorAll("h3")].filter(
		(h) => text(h) === "이전 건물 거래",
	);
	out.block = {
		domTotal: h3s.length,
		visibleCount: h3s.filter(vis).length,
		bodyHasDescription: (document.body.textContent ?? "").includes(
			"재건축 전 건물에서 있었던 거래예요",
		),
	};
	if (prevBlock && prevH3 && vis(prevH3)) {
		const bc = getComputedStyle(prevBlock);
		const hw = prevH3.parentElement as HTMLElement;
		const hwc = getComputedStyle(hw);
		const pEl = prevH3.nextElementSibling;
		const listEl = hw.nextElementSibling;
		Object.assign(out.block, {
			parentIsSection: prevBlock.parentElement === sec,
			isLastChildOfSection: sec.lastElementChild === prevBlock,
			afterTitle:
				!!h2 &&
				!!(
					h2.compareDocumentPosition(prevBlock) &
					Node.DOCUMENT_POSITION_FOLLOWING
				),
			padTop: bc.paddingTop,
			gap: bc.rowGap,
			headingGap: hwc.rowGap,
			rect: R(prevBlock),
			h3: {
				text: text(prevH3),
				tag: prevH3.tagName,
				rect: R(prevH3),
				...sty(prevH3),
			},
			p: pEl
				? { text: text(pEl), tag: pEl.tagName, rect: R(pEl), ...sty(pEl) }
				: null,
			list: listEl
				? {
						tag: listEl.tagName,
						role: listEl.getAttribute("role"),
						label: listEl.getAttribute("aria-label"),
						rect: R(listEl),
					}
				: null,
			text: prevBlock.textContent,
		});
	}
	return out;
}
