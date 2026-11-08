export type NearbyRect = {
	x: number;
	y: number;
	w: number;
	h: number;
	r: number;
	b: number;
};

export type NearbyText = NearbyRect & {
	t: string;
	fs: string;
	lh: string;
	fw: string;
	color: string;
	ta: string;
};

export type NearbyRow = {
	rect: NearbyRect;
	tag: string;
	role: string | null;
	pad: string;
	bbw: string;
	bbs: string;
	bbc: string;
	cols: string;
	cgap: string;
	texts: NearbyText[];
	chip: (NearbyRect & { bg: string; radius: string; pad: string }) | null;
	cells: number;
	heads: number;
};

export type NearbyNote = NearbyRect & {
	role: string | null;
	bg: string;
	color: string;
	radius: string;
	minH: string;
	pad: string;
	align: string;
	gap: string;
	texts: (NearbyText & { tag: string })[];
	svg: (NearbyRect & { color: string; ariaHidden: string | null }) | null;
	prevGap: number | null;
};

export type NearbyDealsMeasure = {
	vw: number;
	scrollW: number;
	dupIds: string[];
	bodyText: string;
	found: boolean;
	section?: NearbyRect & { bw: string };
	summary?: {
		rect: NearbyRect;
		ai: string;
		jc: string;
		pt: string;
		pb: string;
		display: string;
		label: NearbyText;
		count: {
			t: string;
			tag: string;
			fs: string;
			lh: string;
			fw: string;
			color: string;
		} & NearbyRect;
		base: NearbyText;
		baseBaseline: number;
		countBaseline: number;
		prevGap: number | null;
		nextGap: number | null;
		nextTag: string | null;
	} | null;
	ul?: number;
	tables?: number;
	tableLabel?: string | null;
	lis?: NearbyRow[];
	header?: NearbyRow | null;
	trs?: NearbyRow[];
	list?: NearbyRect | null;
	notes?: NearbyNote[];
};

/** 보이는 주변 전월세 거래 섹션의 건수 줄, 목록, 안내 상자를 측정함. 좌표는 문서 기준(스크롤 포함)임. 페이지 안에서 실행하므로 외부 변수를 쓰지 않음 */
export function measureNearbyDeals(): NearbyDealsMeasure {
	const text = (node: Node | null | undefined) =>
		(node?.textContent ?? "").trim();
	const vis = (e: Element | null | undefined) =>
		!!e &&
		e.getClientRects().length > 0 &&
		getComputedStyle(e).visibility !== "hidden";
	const toRect = (r: DOMRect): NearbyRect => ({
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
	const baselineOf = (el: Element) => {
		const s = document.createElement("span");
		s.style.cssText =
			"display:inline-block;width:0;height:0;vertical-align:baseline";
		el.appendChild(s);
		const b = s.getBoundingClientRect().bottom + scrollY;
		s.remove();
		return b;
	};
	const doc = document.documentElement;
	const ids = [...document.querySelectorAll("[id]")].map((e) => e.id);
	const out: NearbyDealsMeasure = {
		vw: doc.clientWidth,
		scrollW: doc.scrollWidth,
		dupIds: [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))],
		bodyText: document.body.innerText,
		found: false,
	};
	const h2 = [...document.querySelectorAll("h2")].find(
		(e) => text(e) === "주변 전월세 거래" && vis(e),
	);
	const section = h2?.closest("section");
	if (!section) return out;
	out.found = true;
	const sc = getComputedStyle(section);
	out.section = { ...R(section), bw: sc.borderBottomWidth };
	const tinfo = (n: Node): NearbyText => {
		const c = getComputedStyle(n.parentElement as Element);
		return {
			t: text(n),
			...TR(n),
			fs: c.fontSize,
			lh: c.lineHeight,
			fw: c.fontWeight,
			color: c.color,
			ta: c.textAlign,
		};
	};
	const texts = (root: Element) => {
		const a: Node[] = [];
		const wk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
		while (wk.nextNode()) {
			const n = wk.currentNode;
			if (text(n) && vis(n.parentElement)) a.push(n);
		}
		return a;
	};

	// 건수 줄
	const sumP = [...section.querySelectorAll("p")].find(
		(p) =>
			vis(p) &&
			text(p).startsWith("조건에 맞는 거래") &&
			p.querySelector("strong"),
	);
	out.summary = null;
	const strong = sumP?.querySelector("strong");
	const row = sumP?.parentElement;
	const base = sumP?.nextElementSibling;
	if (sumP && strong && row && base) {
		const rc = getComputedStyle(row);
		const tn = texts(sumP);
		const sc2 = getComputedStyle(strong);
		const prev = row.previousElementSibling;
		const next = row.nextElementSibling;
		out.summary = {
			rect: R(row),
			ai: rc.alignItems,
			jc: rc.justifyContent,
			pt: rc.paddingTop,
			pb: rc.paddingBottom,
			display: rc.display,
			label: tinfo(tn[0]),
			count: {
				t: text(strong),
				tag: strong.tagName,
				...R(strong),
				fs: sc2.fontSize,
				lh: sc2.lineHeight,
				fw: sc2.fontWeight,
				color: sc2.color,
			},
			base: tinfo(texts(base)[0]),
			baseBaseline: baselineOf(base),
			countBaseline: baselineOf(strong),
			prevGap: prev ? R(row).y - R(prev).b : null,
			nextGap: next ? R(next).y - R(row).b : null,
			nextTag: next ? next.tagName : null,
		};
	}

	// 목록
	out.ul = [...section.querySelectorAll("ul")].filter(vis).length;
	const tables = [...section.querySelectorAll('[role="table"]')].filter(vis);
	out.tables = tables.length;
	out.tableLabel = tables[0] ? tables[0].getAttribute("aria-label") : null;
	const mkRow = (e: Element): NearbyRow => {
		const ns = texts(e);
		const vr =
			[e, ...e.querySelectorAll("*")].find(
				(d) => getComputedStyle(d).borderBottomWidth !== "0px",
			) || e;
		const c = getComputedStyle(vr);
		const chipN = ns.find((n) => ["신규", "갱신"].includes(text(n)));
		let chip: NearbyRow["chip"] = null;
		if (chipN) {
			let el = chipN.parentElement;
			while (
				el &&
				el !== e &&
				getComputedStyle(el).backgroundColor === "rgba(0, 0, 0, 0)"
			) {
				el = el.parentElement;
			}
			if (el) {
				const cc = getComputedStyle(el);
				chip = {
					...R(el),
					bg: cc.backgroundColor,
					radius: cc.borderTopLeftRadius,
					pad: `${cc.paddingTop} ${cc.paddingRight} ${cc.paddingBottom} ${cc.paddingLeft}`,
				};
			}
		}
		return {
			rect: R(vr),
			tag: e.tagName,
			role: e.getAttribute("role"),
			pad: `${c.paddingTop} ${c.paddingBottom}`,
			bbw: c.borderBottomWidth,
			bbs: c.borderBottomStyle,
			bbc: c.borderBottomColor,
			cols: c.gridTemplateColumns,
			cgap: c.columnGap,
			texts: ns.map(tinfo),
			chip,
			cells: e.querySelectorAll('[role="cell"]').length,
			heads: e.querySelectorAll('[role="columnheader"]').length,
		};
	};
	out.lis = [...section.querySelectorAll("ul > li")].filter(vis).map(mkRow);
	const trs = tables[0]
		? [...tables[0].querySelectorAll('[role="row"]')].filter(vis)
		: [];
	const hdr = trs.find((e) => e.querySelector('[role="columnheader"]'));
	out.header = hdr ? mkRow(hdr) : null;
	out.trs = trs.filter((e) => e !== hdr).map(mkRow);
	const firstUl = section.querySelector("ul");
	const list = firstUl && vis(firstUl) ? firstUl : tables[0];
	out.list = list ? R(list) : null;

	// 확정일자 안내
	out.notes = [...section.querySelectorAll('[role="note"]')]
		.filter(vis)
		.map((note) => {
			const nc = getComputedStyle(note);
			const svg = note.querySelector("svg");
			const ns = texts(note);
			return {
				...R(note),
				role: note.getAttribute("role"),
				bg: nc.backgroundColor,
				color: nc.color,
				radius: nc.borderTopLeftRadius,
				minH: nc.minHeight,
				pad: `${nc.paddingTop} ${nc.paddingRight} ${nc.paddingBottom} ${nc.paddingLeft}`,
				align: nc.alignItems,
				gap: nc.columnGap,
				texts: ns.map((n) => ({
					...tinfo(n),
					tag: (n.parentElement as Element).tagName,
				})),
				svg: svg
					? {
							...R(svg),
							color: getComputedStyle(svg).color,
							ariaHidden: svg.getAttribute("aria-hidden"),
						}
					: null,
				prevGap: note.previousElementSibling
					? R(note).y - R(note.previousElementSibling).b
					: null,
			};
		});
	return out;
}
