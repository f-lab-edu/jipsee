export type C10Rect = {
	x: number;
	y: number;
	w: number;
	h: number;
	r: number;
	b: number;
};

export type C10Label = {
	rect: C10Rect;
	cellW: number;
	fs: string;
	lh: string;
	fw: string;
	color: string;
};

export type C10Chip = {
	text: string;
	href: string | null;
	cur: string | null;
	rect: C10Rect;
	bg: string;
	radius: number;
	pad: string;
	color: string;
	fw: string;
	fs: string;
	lh: string;
};

export type C10Group = {
	labelledBy: string | null;
	labelText: string | null;
	rect: C10Rect;
	label: C10Label | null;
	chips: C10Chip[];
};

export type C10Svg = {
	rect: C10Rect;
	color: string;
	ariaHidden: string | null;
};

export type C10Area = {
	text: string;
	rect: C10Rect;
	fs: string;
	lh: string;
	fw: string;
	color: string;
	svg: (C10Svg & { stroke: string }) | null;
	label: C10Label | null;
};

export type C10Notice = {
	text: string;
	noRole?: boolean;
	role?: string | null;
	rect?: C10Rect;
	bg?: string;
	color?: string;
	radius?: string;
	minH?: string;
	pad?: string;
	align?: string;
	gap?: string;
	textRect?: C10Rect;
	pRect?: C10Rect;
	fs?: string;
	lh?: string;
	fw?: string;
	tcolor?: string;
	tag?: string;
	svg?: C10Svg | null;
};

export type C10Measure = {
	vw: number;
	scrollW: number;
	scrollY: number;
	dupIds: string[];
	nearbyIds: string[];
	titleDom: number;
	titleIdsDom: string[];
	visibleTitles: number;
	section?: {
		rect: C10Rect;
		pad: string;
		radius: string;
		bw: string;
		bc: string;
		bg: string;
		gap: string;
		labelledBy: string | null;
	};
	title?: {
		id: string;
		rect: C10Rect;
		fs: string;
		lh: string;
		fw: string;
		color: string;
		text: string;
	};
	prev?: { rect: C10Rect; h: string; bg: string; tag: string } | null;
	dealBottom?: number | null;
	groups?: C10Group[];
	box?: {
		rect: C10Rect;
		bg: string;
		pad: string;
		radius: string;
		rowGap: string;
		colGap: string;
		wrap: string;
		dir: string;
	};
	area?: C10Area | null;
	notice?: C10Notice | null;
	noteCount?: number;
	bodyHasNotice?: boolean;
};

/** 주변 전월세 거래의 골격과 필터를 측정함. 좌표는 문서 기준(스크롤 포함)임. 페이지 안에서 실행하므로 외부 변수를 쓰지 않음 */
export function c10MeasureNearby(): C10Measure {
	const text = (node: Node | null | undefined) =>
		(node?.textContent ?? "").trim();
	const vis = (e: Element | null | undefined) =>
		!!e &&
		e.getClientRects().length > 0 &&
		getComputedStyle(e).visibility !== "hidden";
	const toRect = (r: DOMRect): C10Rect => ({
		x: r.x,
		y: r.y + scrollY,
		w: r.width,
		h: r.height,
		r: r.right,
		b: r.bottom + scrollY,
	});
	const R = (e: Element) => toRect(e.getBoundingClientRect());
	const TR = (n: Node) => {
		const g = document.createRange();
		g.selectNodeContents(n);
		return toRect(g.getBoundingClientRect());
	};
	const cellWidth = (e: Element) =>
		e.parentElement?.getBoundingClientRect().width ?? Number.NaN;
	const labelOf = (e: Element): C10Label => {
		const c = getComputedStyle(e);
		return {
			rect: TR(e),
			cellW: cellWidth(e),
			fs: c.fontSize,
			lh: c.lineHeight,
			fw: c.fontWeight,
			color: c.color,
		};
	};
	const doc = document.documentElement;
	const ids = [...document.querySelectorAll("[id]")].map((e) => e.id);
	const all = [...document.querySelectorAll("h2")].filter(
		(e) => text(e) === "주변 전월세 거래",
	);
	const h2 = all.find(vis);
	const out: C10Measure = {
		vw: doc.clientWidth,
		scrollW: doc.scrollWidth,
		scrollY: window.scrollY,
		dupIds: [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))],
		nearbyIds: ids.filter((id) => id.startsWith("nearby-")).sort(),
		titleDom: all.length,
		titleIdsDom: all.map((e) => e.id).sort(),
		visibleTitles: all.filter(vis).length,
	};
	const section = h2?.closest("section");
	if (!h2 || !section) return out;
	const cs = getComputedStyle(section);
	out.section = {
		rect: R(section),
		pad: `${cs.paddingTop} ${cs.paddingRight} ${cs.paddingBottom} ${cs.paddingLeft}`,
		radius: cs.borderTopLeftRadius,
		bw: cs.borderTopWidth,
		bc: cs.borderTopColor,
		bg: cs.backgroundColor,
		gap: cs.rowGap,
		labelledBy: section.getAttribute("aria-labelledby"),
	};
	const hc = getComputedStyle(h2);
	out.title = {
		id: h2.id,
		rect: R(h2),
		fs: hc.fontSize,
		lh: hc.lineHeight,
		fw: hc.fontWeight,
		color: hc.color,
		text: text(h2),
	};
	const prev = section.previousElementSibling;
	out.prev = prev
		? {
				rect: R(prev),
				h: getComputedStyle(prev).height,
				bg: getComputedStyle(prev).backgroundColor,
				tag: prev.tagName,
			}
		: null;
	const deal = [...document.querySelectorAll("h2")].filter(
		(e) => text(e) === "거래 이력" && vis(e),
	)[0];
	const dealSection = deal?.closest("section");
	out.dealBottom = dealSection ? R(dealSection).b : null;

	const groups = [...section.querySelectorAll('[role="group"]')].filter(vis);
	out.groups = groups.map((g) => {
		const lid = g.getAttribute("aria-labelledby");
		const label = lid ? document.getElementById(lid) : null;
		const chips = [...g.querySelectorAll("a")].filter(vis).map((a) => {
			const c = getComputedStyle(a);
			const tx = a.firstElementChild || a;
			const tc = getComputedStyle(tx);
			return {
				text: text(a),
				href: a.getAttribute("href"),
				cur: a.getAttribute("aria-current"),
				rect: R(a),
				bg: c.backgroundColor,
				radius: Number.parseFloat(c.borderTopLeftRadius),
				pad: `${c.paddingTop} ${c.paddingRight} ${c.paddingBottom} ${c.paddingLeft}`,
				color: tc.color,
				fw: tc.fontWeight,
				fs: tc.fontSize,
				lh: tc.lineHeight,
			};
		});
		return {
			labelledBy: lid,
			labelText: label ? text(label) : null,
			rect: R(g),
			label: label ? labelOf(label) : null,
			chips,
		};
	});
	const g0 = groups[0];
	const fb = g0?.parentElement;
	if (fb) {
		const fc = getComputedStyle(fb);
		out.box = {
			rect: R(fb),
			bg: fc.backgroundColor,
			pad: `${fc.paddingTop} ${fc.paddingRight} ${fc.paddingBottom} ${fc.paddingLeft}`,
			radius: fc.borderTopLeftRadius,
			rowGap: fc.rowGap,
			colGap: fc.columnGap,
			wrap: fc.flexWrap,
			dir: fc.flexDirection,
		};
	}

	// 면적 고정 줄
	const wk = document.createTreeWalker(section, NodeFilter.SHOW_TEXT);
	out.area = null;
	out.notice = null;
	while (wk.nextNode()) {
		const n = wk.currentNode;
		const t = text(n);
		const el = n.parentElement;
		if (!t || !el || !vis(el)) continue;
		if (t.startsWith("이 건물 거래 면적")) {
			const c = getComputedStyle(el);
			const svg = el.parentElement?.querySelector("svg");
			const labelEl = [...section.querySelectorAll("span,p")].find(
				(e) => text(e) === "면적" && vis(e),
			);
			out.area = {
				text: t,
				rect: TR(n),
				fs: c.fontSize,
				lh: c.lineHeight,
				fw: c.fontWeight,
				color: c.color,
				svg: svg
					? {
							rect: R(svg),
							color: getComputedStyle(svg).color,
							stroke: getComputedStyle(svg).stroke,
							ariaHidden: svg.getAttribute("aria-hidden"),
						}
					: null,
				label: labelEl ? labelOf(labelEl) : null,
			};
		} else if (t.startsWith("이 건물은 위치 정보가")) {
			const note = el.closest('[role="note"]');
			if (!note) {
				out.notice = { text: t, noRole: true };
				continue;
			}
			const nc = getComputedStyle(note);
			const c = getComputedStyle(el);
			const svg = note.querySelector("svg");
			out.notice = {
				text: t,
				role: note.getAttribute("role"),
				rect: R(note),
				bg: nc.backgroundColor,
				color: nc.color,
				radius: nc.borderTopLeftRadius,
				minH: nc.minHeight,
				pad: `${nc.paddingTop} ${nc.paddingRight} ${nc.paddingBottom} ${nc.paddingLeft}`,
				align: nc.alignItems,
				gap: nc.columnGap,
				textRect: TR(n),
				pRect: R(el),
				fs: c.fontSize,
				lh: c.lineHeight,
				fw: c.fontWeight,
				tcolor: c.color,
				tag: el.tagName,
				svg: svg
					? {
							rect: R(svg),
							color: getComputedStyle(svg).color,
							ariaHidden: svg.getAttribute("aria-hidden"),
						}
					: null,
			};
		}
	}
	// 확정일자 안내(C11)와 조건 확장 안내(C12)는 위치 정보 없음 안내가 아니라서 세지 않음
	out.noteCount = [...section.querySelectorAll('[role="note"]')].filter(
		(n) =>
			!(n.textContent ?? "").includes("확정일자") &&
			!(n.textContent ?? "").includes("반경이나 기간을 넓혀 보세요"),
	).length;
	out.bodyHasNotice = document.body.innerText.includes("위치 정보가 없어서");
	return out;
}
